import { Button, Grid } from '@mui/material'
import { Box, styled } from '@mui/system';
import styles from '../styles/Home.module.css'
import * as React from 'react'

const HiddenInput = styled('input')({
  display: 'none',
});

const to16bitHex = (data: number) => '0x' + data.toString(16).padStart(4, '0');

class Memory {
  data: number[];
  size: number;
  memoryViewAddress: number;

  constructor(data: number[] = [], size: number = 0, memoryViewAddress: number = 0) {
    this.data = data;
    this.size = size;
    this.memoryViewAddress = memoryViewAddress;
  }

  static importFromMif(mifFile: string) {
    const lines = mifFile.split('\n');
    const headerLength = lines.indexOf('CONTENT BEGIN');

    if (headerLength == -1) {
      console.error('Data Error: CONTENT BEGIN is not found.');
      return;
    }

    const headers = lines.slice(0, headerLength);
    const width = parseInt(Memory.parseMifHeader(headers.find(s => s.startsWith('WIDTH')), '16'));
    const depth = parseInt(Memory.parseMifHeader(headers.find(s => s.startsWith('DEPTH')), '4096'));
    const addressRadix = Memory.parseMifHeader(headers.find(s => s.startsWith('ADDRESS_RADIX')), 'DEC');
    const dataRadix = Memory.parseMifHeader(headers.find(s => s.startsWith('DATA_RADIX')), 'DEC');
    if (width != 16) {
      console.error('Not Implemented: WIDTH in mif file should be 16.');
      return;
    }
    if (addressRadix != 'DEC') {
      console.error('Not Implemented: ADDRESS_RADIX in mif file should be DEC.');
      return;
    }
    if (dataRadix != 'DEC') {
      console.error('Not Implemented: DATA_RADIX in mif file should be DEC.');
      return;
    }
    const data = lines.slice(headerLength + 1, headerLength + depth + 1).map(s => Memory.parseMifContent(s, width));
    return new Memory(data, depth);
  }

  private static parseMifHeader(line: string | undefined, defaultValue: string) {
    if (!line) {
      return defaultValue;
    }
    const equalCharIndex = line.indexOf('=');
    return line.slice(equalCharIndex + 1, -1).trim();
  }

  private static parseMifContent(line: string, width: number) {
    const value = parseInt(line.slice(line.indexOf(':') + 1, -1).trim());
    if (0 <= value) {
      return value;
    } else {
      return value + (1 << width);
    }
  }

  read(addr: number) {
    return this.data[addr] || 0;
  }

  getMemoryView() {
    const view = this.data.slice(this.memoryViewAddress, this.memoryViewAddress + 0x10);
    return view.map((value, i) => ([to16bitHex(this.memoryViewAddress + i), to16bitHex(value)]));
  }

  getMemoryViewAddress() {
    return to16bitHex(this.memoryViewAddress);
  }

  static onChangeMemAddressRelative = (memory: Memory, offset: number) => {
    const memoryViewAddress = memory.alignMemAddress(memory.memoryViewAddress + offset);
    return new Memory(memory.data, memory.size, memoryViewAddress);
  }

  static onChangeMemAddressAbsolute = (memory: Memory, addr: number) => {
    const memoryViewAddress = memory.alignMemAddress(addr);
    return new Memory(memory.data, memory.size, memoryViewAddress);
  }

  alignMemAddress = (address: number) => {
    if (address < 0) {
      return (address + this.size) & 0xfff0;
    }
    if (this.size - 0x10 < address) {
      return (address - this.size) & 0xfff0;
    }
    return address & 0xfff0;
  };
}

class RegisterFile {
  data: number[] = Array(8).fill(0);

  constructor(data: number[] | undefined = undefined) {
    if (data) {
      this.data = data;
    }
  }

  read(addr: number) {
    return this.data[addr];
  }

  readHex(addr: number) {
    return to16bitHex(this.data[addr] || 0);
  }

  static write(regFile: RegisterFile, addr: number, value: number) {
    const newData = regFile.data;
    newData[addr] = value;
    return new RegisterFile(newData);
  }
}

class FDRegister {
  instructionRegister: number;
  pc: number;
  nextPC: number;

  constructor(instructionRegister: number = 0, pc: number = 0, nextPC: number = 0) {
    this.instructionRegister = instructionRegister;
    this.pc = pc;
    this.nextPC = nextPC;
  }
}

class DERegister {
  readRegisterASelect: number;
  readRegisterBSelect: number;
  writeRegisterSelect: number;
  immediate: number;
  aluOpcode: number;
  branchCondition: number;
  nextPC: number;
  finflag: boolean;

  constructor(readRegisterASelect: number = 0, readRegisterBSelect: number = 0, writeRegisterSelect: number = 0, immediate: number = 0, aluOpcode: number = 0, branchCondition: number = 0, nextPC: number = 0, finflag: boolean = false) {
    this.readRegisterASelect = readRegisterASelect;
    this.readRegisterBSelect = readRegisterBSelect;
    this.writeRegisterSelect = writeRegisterSelect;
    this.immediate = immediate;
    this.aluOpcode = aluOpcode;
    this.branchCondition = branchCondition;
    this.nextPC = nextPC;
    this.finflag = finflag;
  }
}

const FlagSMask = 0x8;
const FlagZMask = 0x4;
const FlagCMask = 0x2;
const FlagVMask = 0x1;

class EWRegister {
  writeRegisterSelect: number;
  dataRegister: number;
  isBranching: boolean;
  flags: number;
  finflag: boolean;

  constructor(writeRegisterSelect: number = 0, dataRegister: number = 0, isBranching: boolean = false, flags: number = 0, finflag: boolean = false) {
    this.writeRegisterSelect = writeRegisterSelect;
    this.dataRegister = dataRegister;
    this.isBranching = isBranching;
    this.flags = flags;
    this.finflag = finflag;
  }

  isFlagS() {
    return (this.flags & FlagSMask) != 0;
  }

  isFlagZ() {
    return (this.flags & FlagZMask) != 0;
  }

  isFlagC() {
    return (this.flags & FlagCMask) != 0;
  }

  isFlagV() {
    return (this.flags & FlagVMask) != 0;
  }

  showFlag() {
    return (this.isFlagS() ? 'S' : '-') +
      (this.isFlagZ() ? 'Z' : '-') +
      (this.isFlagC() ? 'C' : '-') +
      (this.isFlagV() ? 'V' : '-');
  }

  static createFlag(s: boolean, z: boolean, c: boolean, v: boolean) {
    return (s ? FlagSMask : 0) +
      (z ? FlagZMask : 0) +
      (c ? FlagCMask : 0) +
      (v ? FlagVMask : 0);
  }
}

class OutputRegister {
  output: number;
  finFlag: boolean;

  constructor(output: number = 0, finFlag: boolean = false) {
    this.output = output;
    this.finFlag = finFlag;
  }
}

class PhaseCounter {
  isFetchInstructionPhase() {
    return false;
  }

  isDecodeInstructionPhase() {
    return false;
  }

  isExecutePhase() {
    return false;
  }

  isWriteBackPhase() {
    return false;
  }

  hasNext() {
    return false;
  }
}

class NormalPhaseCounter extends PhaseCounter {
  data: number = 0;

  constructor(data: number = 0) {
    super();
    this.data = data;
  }

  read() {
    return this.data;
  }

  isFetchInstructionPhase() {
    return this.data == 0;
  }

  isDecodeInstructionPhase() {
    return this.data == 1;
  }

  isExecutePhase() {
    return this.data == 2;
  }

  isWriteBackPhase() {
    return this.data == 3;
  }

  hasNext() {
    return true;
  }

  static next(pc: NormalPhaseCounter) {
    const value = pc.data + 1;
    if (4 <= value) {
      return new NormalPhaseCounter(0);
    }
    return new NormalPhaseCounter(value);
  }
}

const OpCode1Mask = 0b1100_0000_0000_0000;
const OpCode1 = {
  LD: 0b0000_0000_0000_0000,
  ST: 0b0100_0000_0000_0000,
  Branch: 0b1000_0000_0000_0000,
  ComputeIO: 0b1100_0000_0000_0000,
}

// Branch: 10
const OpCode2Mask = 0b0011_1000_0000_0000;
const OpCode2 = {
  LI: 0b0000_0000_0000_0000,
  Branch: 0b0010_0000_0000_0000,
  ConditionalBranch: 0b0011_1000_0000_0000,
}

// Branch_Conditional 1011_1
const BranchConditionMask = 0b0000_0111_0000_0000;
const BranchConditionCode = {
  BE: 0b0000_0000_0000_0000,
  BLT: 0b0000_0001_0000_0000,
  BLE: 0b0000_0010_0000_0000,
  BNE: 0b0000_0011_0000_0000,
}
const ImmediateMask = 0b0000_0000_1111_1111;
const ImmediateSignMask = 0b0000_0000_1000_0000;
const ImmediateSignExt = 0b1111_1111_1000_0000;
const RaMask = 0b0011_1000_0000_0000;
const RaShift = 11;
const RbMask = 0b0000_0111_0000_0000;
const RbShift = 8;

// ComputeIO: 11
const OpCode3Mask = 0b0000_0000_1111_0000;
const OpCode3 = {
  ADD: 0b0000_0000_0000_0000,
  SUB: 0b0000_0000_0001_0000,
  AND: 0b0000_0000_0010_0000,
  OR: 0b0000_0000_0011_0000,
  XOR: 0b0000_0000_0100_0000,
  CMP: 0b0000_0000_0101_0000,
  MOV: 0b0000_0000_0110_0000,

  SLL: 0b0000_0000_1000_0000,
  SLR: 0b0000_0000_1001_0000,
  SRL: 0b0000_0000_1010_0000,
  SRA: 0b0000_0000_1011_0000,
  IN: 0b0000_0000_1100_0000,
  OUT: 0b0000_0000_1101_0000,

  HLT: 0b0000_0000_1111_0000,
}
const ComputeIOImmediateMask = 0b0000_0000_0000_1111;
const ComputeIOImmediateSignMask = 0b0000_0000_0000_1000;
const ComputeIOImmediateSignExt = 0b1111_1111_1111_0000;
const RsMask = 0b0011_1000_0000_0000;
const RsShift = 11;
const RdMask = 0b0000_0111_0000_0000;
const RdShift = 8;

const RegReadASelect = {
  R0: 0b0000,
  R1: 0b0001,
  R2: 0b0010,
  R3: 0b0011,
  R4: 0b0100,
  R5: 0b0101,
  R6: 0b0110,
  R7: 0b0111,
  Zero: 0b1000,
  PCNext: 0b1001,
}

const RegReadBSelect = {
  R0: 0b0000,
  R1: 0b0001,
  R2: 0b0010,
  R3: 0b0011,
  R4: 0b0100,
  R5: 0b0101,
  R6: 0b0110,
  R7: 0b0111,
  Imm: 0b1010,
}

const RegWriteSelect = {
  R0: 0b0000,
  R1: 0b0001,
  R2: 0b0010,
  R3: 0b0011,
  R4: 0b0100,
  R5: 0b0101,
  R6: 0b0110,
  R7: 0b0111,
  Ignore: 0b1000,
  OUT: 0b1111,
}

const ALUOpcode = {
  ADD: 0b0000,
  SUB: 0b0001,
  AND: 0b0010,
  OR: 0b0011,
  XOR: 0b0100,
  SLL: 0b0101,
  SLR: 0b0110,
  SRL: 0b0111,
  SRA: 0b1000,
}

const BranchCondition = {
  Never: 0b000,
  Always: 0b001,
  IfZ: 0b010,
  IfSV: 0b011,
  IfSVorZ: 0b100,
  IfNotZ: 0b101,
}


class Core {
  main(memory: Memory, registerFile: RegisterFile, fdRegister: FDRegister, deRegister: DERegister, ewRegister: EWRegister, outputRegister: OutputRegister, phaseCounter: PhaseCounter) {
    let newFDRegister = fdRegister;
    let newDERegister = deRegister;
    let newEWRegister = ewRegister;
    let newOutputRegister = outputRegister;
    let newRegisterFile = registerFile;
    let newPhaseCounter = phaseCounter;
    if (phaseCounter.isFetchInstructionPhase()) {
      const value = this.instructionFetchPhase(newFDRegister.nextPC, newEWRegister.dataRegister, newEWRegister.isBranching, memory);
      newFDRegister = new FDRegister(value.instruction, value.pc, value.pcNext);
    }
    if (phaseCounter.isDecodeInstructionPhase()) {
      const value = this.instructionDecodePhase(newFDRegister.instructionRegister, newFDRegister.nextPC);
      newDERegister = new DERegister(value.rRegA, value.rRegB, value.wReg, value.imm, value.aluOpcode, value.branchCondition, value.pcNext, value.finflag);
    }
    if (phaseCounter.isExecutePhase()) {
      const value = this.executionPhase(newDERegister.branchCondition, newDERegister.aluOpcode, newDERegister.nextPC, newDERegister.readRegisterASelect, newDERegister.readRegisterBSelect, newDERegister.immediate, newDERegister.writeRegisterSelect, newEWRegister.flags, registerFile);
      newEWRegister = new EWRegister(value.wReg, value.value, value.isBranching, value.flag, newDERegister.finflag);
    }
    if (phaseCounter.isWriteBackPhase()) {
      const value = this.writeBackPhase(newEWRegister.writeRegisterSelect, newEWRegister.dataRegister, newEWRegister.finflag, registerFile, newOutputRegister);
      newRegisterFile = value.newRegisterFile;
      newOutputRegister = value.newOutputRegister;
    }
    if (phaseCounter instanceof NormalPhaseCounter) {
      newPhaseCounter = NormalPhaseCounter.next(phaseCounter);
    }
    const newMemory = Memory.onChangeMemAddressAbsolute(memory, newFDRegister.pc);
    return {
      memory: newMemory,
      registerFile: newRegisterFile,
      fdRegister: newFDRegister,
      deRegister: newDERegister,
      ewRegister: newEWRegister,
      outputRegister: newOutputRegister,
      phaseCounter: newPhaseCounter,
    }
  }

  instructionFetchPhase(pcIn: number, dataRegister: number, isBranching: boolean, memory: Memory) {
    const pc = isBranching ? dataRegister : pcIn;
    const instruction = memory.read(pc);
    const pcNext = (pc + 1) & 0xffff;
    return { pc, pcNext, instruction };
  }

  instructionDecodePhase(instruction: number, pcNext: number) {
    const finflag = false;
    const opCode1 = instruction & OpCode1Mask;

    if (opCode1 == OpCode1.LD) {
      // TODO: Not Implemented
    }
    else if (opCode1 == OpCode1.ST) {
      // TODO: Not Implemented
    }
    else if (opCode1 == OpCode1.Branch) {
      const opCode2 = instruction & OpCode2Mask;
      const immediate = instruction & ImmediateMask;
      const immediateSign = (immediate & ImmediateSignMask) == ImmediateSignMask;
      const imm = (immediateSign ? ImmediateSignExt : 0) + immediate;
      if (opCode2 == OpCode2.LI) {
        const branchCondition = BranchCondition.Never;
        const aluOpcode = ALUOpcode.ADD;
        const rRegA = RegReadASelect.Zero;
        const rRegB = RegReadBSelect.Imm;
        const wReg = ((instruction & RbMask) >> RbShift);
        return {
          branchCondition,
          aluOpcode,
          pcNext,
          rRegA,
          rRegB,
          imm,
          wReg,
          finflag,
        }
      }
      else if (opCode2 == OpCode2.Branch) {
        const branchCondition = BranchCondition.Always;
        const aluOpcode = ALUOpcode.ADD;
        const rRegA = RegReadASelect.PCNext;
        const rRegB = RegReadBSelect.Imm;
        const wReg = RegWriteSelect.Ignore;
        return {
          branchCondition,
          aluOpcode,
          pcNext,
          rRegA,
          rRegB,
          imm,
          wReg,
          finflag,
        }
      }
      else if (opCode2 == OpCode2.ConditionalBranch) {
        const cond = instruction & BranchConditionMask;
        const aluOpcode = ALUOpcode.ADD;
        const rRegA = RegReadASelect.PCNext;
        const rRegB = RegReadBSelect.Imm;
        const wReg = RegWriteSelect.Ignore;
        if (cond == BranchConditionCode.BE) {
          const branchCondition = BranchCondition.IfZ;
          return {
            branchCondition,
            aluOpcode,
            pcNext,
            rRegA,
            rRegB,
            imm,
            wReg,
            finflag,
          }
        }
        else if (cond == BranchConditionCode.BLT) {
          const branchCondition = BranchCondition.IfSV;
          return {
            branchCondition,
            aluOpcode,
            pcNext,
            rRegA,
            rRegB,
            imm,
            wReg,
            finflag,
          }
        }
        else if (cond == BranchConditionCode.BLE) {
          const branchCondition = BranchCondition.IfSVorZ;
          return {
            branchCondition,
            aluOpcode,
            pcNext,
            rRegA,
            rRegB,
            imm,
            wReg,
            finflag,
          }
        }
        else if (cond == BranchConditionCode.BNE) {
          const branchCondition = BranchCondition.IfNotZ;
          return {
            branchCondition,
            aluOpcode,
            pcNext,
            rRegA,
            rRegB,
            imm,
            wReg,
            finflag,
          }
        }
      }
    }
    else if (opCode1 == OpCode1.ComputeIO) {
      const opCode3 = instruction & OpCode3Mask;
      if (opCode3 == OpCode3.ADD) {
        const branchCondition = BranchCondition.Never;
        const aluOpcode = ALUOpcode.ADD;
        const rRegA = (instruction & RdMask) >> RdShift;
        const rRegB = (instruction & RsMask) >> RsShift;
        const imm = 0;
        const wReg = rRegA;
        return {
          branchCondition,
          aluOpcode,
          pcNext,
          rRegA,
          rRegB,
          imm,
          wReg,
          finflag,
        }
      }
      else if (opCode3 == OpCode3.SUB) {
        const branchCondition = BranchCondition.Never;
        const aluOpcode = ALUOpcode.SUB;
        const rRegA = (instruction & RdMask) >> RdShift;
        const rRegB = (instruction & RsMask) >> RsShift;
        const imm = 0;
        const wReg = rRegA;
        return {
          branchCondition,
          aluOpcode,
          pcNext,
          rRegA,
          rRegB,
          imm,
          wReg,
          finflag,
        }
      }
      else if (opCode3 == OpCode3.AND) {
        const branchCondition = BranchCondition.Never;
        const aluOpcode = ALUOpcode.AND;
        const rRegA = (instruction & RdMask) >> RdShift;
        const rRegB = (instruction & RsMask) >> RsShift;
        const imm = 0;
        const wReg = rRegA;
        return {
          branchCondition,
          aluOpcode,
          pcNext,
          rRegA,
          rRegB,
          imm,
          wReg,
          finflag,
        }
      }
      else if (opCode3 == OpCode3.OR) {
        const branchCondition = BranchCondition.Never;
        const aluOpcode = ALUOpcode.OR;
        const rRegA = (instruction & RdMask) >> RdShift;
        const rRegB = (instruction & RsMask) >> RsShift;
        const imm = 0;
        const wReg = rRegA;
        return {
          branchCondition,
          aluOpcode,
          pcNext,
          rRegA,
          rRegB,
          imm,
          wReg,
          finflag,
        }
      }
      else if (opCode3 == OpCode3.XOR) {
        const branchCondition = BranchCondition.Never;
        const aluOpcode = ALUOpcode.XOR;
        const rRegA = (instruction & RdMask) >> RdShift;
        const rRegB = (instruction & RsMask) >> RsShift;
        const imm = 0;
        const wReg = rRegA;
        return {
          branchCondition,
          aluOpcode,
          pcNext,
          rRegA,
          rRegB,
          imm,
          wReg,
          finflag,
        }
      }
      else if (opCode3 == OpCode3.CMP) {
        const branchCondition = BranchCondition.Never;
        const aluOpcode = ALUOpcode.SUB;
        const rRegA = (instruction & RdMask) >> RdShift;
        const rRegB = (instruction & RsMask) >> RsShift;
        const imm = 0;
        const wReg = RegWriteSelect.Ignore;
        return {
          branchCondition,
          aluOpcode,
          pcNext,
          rRegA,
          rRegB,
          imm,
          wReg,
          finflag,
        }
      }
      else if (opCode3 == OpCode3.MOV) {
        const branchCondition = BranchCondition.Never;
        const aluOpcode = ALUOpcode.ADD;
        const rRegA = RegReadASelect.Zero;
        const rRegB = (instruction & RsMask) >> RsShift;
        const imm = 0;
        const wReg = (instruction & RdMask) >> RdShift;
        return {
          branchCondition,
          aluOpcode,
          pcNext,
          rRegA,
          rRegB,
          imm,
          wReg,
          finflag,
        }
      }
      else if (opCode3 == OpCode3.SLL) {
        const branchCondition = BranchCondition.Never;
        const aluOpcode = ALUOpcode.SLL;
        const rRegA = (instruction & RdMask) >> RdShift;
        const rRegB = RegReadBSelect.Imm;
        const immediate = instruction & ComputeIOImmediateMask;
        const immediateSign = (immediate & ComputeIOImmediateSignMask) == ComputeIOImmediateSignMask;
        const imm = (immediateSign ? ComputeIOImmediateSignExt : 0) + immediate;
        const wReg = rRegA;
        return {
          branchCondition,
          aluOpcode,
          pcNext,
          rRegA,
          rRegB,
          imm,
          wReg,
          finflag,
        }
      }
      else if (opCode3 == OpCode3.SLR) {
        const branchCondition = BranchCondition.Never;
        const aluOpcode = ALUOpcode.SLR;
        const rRegA = (instruction & RdMask) >> RdShift;
        const rRegB = RegReadBSelect.Imm;
        const immediate = instruction & ComputeIOImmediateMask;
        const immediateSign = (immediate & ComputeIOImmediateSignMask) == ComputeIOImmediateSignMask;
        const imm = (immediateSign ? ComputeIOImmediateSignExt : 0) + immediate;
        const wReg = rRegA;
        return {
          branchCondition,
          aluOpcode,
          pcNext,
          rRegA,
          rRegB,
          imm,
          wReg,
          finflag,
        }
      }
      else if (opCode3 == OpCode3.SRL) {
        const branchCondition = BranchCondition.Never;
        const aluOpcode = ALUOpcode.SRL;
        const rRegA = (instruction & RdMask) >> RdShift;
        const rRegB = RegReadBSelect.Imm;
        const immediate = instruction & ComputeIOImmediateMask;
        const immediateSign = (immediate & ComputeIOImmediateSignMask) == ComputeIOImmediateSignMask;
        const imm = (immediateSign ? ComputeIOImmediateSignExt : 0) + immediate;
        const wReg = rRegA;
        return {
          branchCondition,
          aluOpcode,
          pcNext,
          rRegA,
          rRegB,
          imm,
          wReg,
          finflag,
        }
      }
      else if (opCode3 == OpCode3.SRA) {
        const branchCondition = BranchCondition.Never;
        const aluOpcode = ALUOpcode.SRA;
        const rRegA = (instruction & RdMask) >> RdShift;
        const rRegB = RegReadBSelect.Imm;
        const immediate = instruction & ComputeIOImmediateMask;
        const immediateSign = (immediate & ComputeIOImmediateSignMask) == ComputeIOImmediateSignMask;
        const imm = (immediateSign ? ComputeIOImmediateSignExt : 0) + immediate;
        const wReg = rRegA;
        return {
          branchCondition,
          aluOpcode,
          pcNext,
          rRegA,
          rRegB,
          imm,
          wReg,
          finflag,
        }
      }
      else if (opCode3 == OpCode3.IN) {
        // TODO: Not Implemented
      }
      else if (opCode3 == OpCode3.OUT) {
        const branchCondition = BranchCondition.Never;
        const aluOpcode = ALUOpcode.ADD;
        const rRegA = RegReadASelect.Zero;
        const rRegB = (instruction & RsMask) >> RsShift;
        const imm = 0;
        const wReg = RegWriteSelect.OUT;
        return {
          branchCondition,
          aluOpcode,
          pcNext,
          rRegA,
          rRegB,
          imm,
          wReg,
          finflag,
        }
      }
      else if (opCode3 == OpCode3.HLT) {
        const branchCondition = BranchCondition.Always;
        const aluOpcode = ALUOpcode.ADD;
        const rRegA = RegReadASelect.PCNext;
        const rRegB = RegReadBSelect.Imm;
        const imm = 0b1111_1111_1111_1111;
        const wReg = RegWriteSelect.Ignore;
        return {
          branchCondition,
          aluOpcode,
          pcNext,
          rRegA,
          rRegB,
          imm,
          wReg,
          finflag: true,
        }
      }
    }

    // Not Implemented: NOP
    return {
      branchCondition: BranchCondition.Never,
      aluOpcode: ALUOpcode.ADD,
      pcNext,
      rRegA: RegReadASelect.R0,
      rRegB: RegReadBSelect.R0,
      imm: 0,
      wReg: RegWriteSelect.Ignore,
      finflag,
    }
  }

  executionPhase(branchCondition: number, aluOpcode: number, pcNext: number, rRegA: number, rRegB: number, immediate: number, wReg: number, prevFlag: number, registerFile: RegisterFile) {
    const readA = () => {
      if (rRegA == RegReadASelect.R0) {
        return registerFile.read(rRegA);
      }
      else if (rRegA == RegReadASelect.R1) {
        return registerFile.read(rRegA);
      }
      else if (rRegA == RegReadASelect.R2) {
        return registerFile.read(rRegA);
      }
      else if (rRegA == RegReadASelect.R3) {
        return registerFile.read(rRegA);
      }
      else if (rRegA == RegReadASelect.R4) {
        return registerFile.read(rRegA);
      }
      else if (rRegA == RegReadASelect.R5) {
        return registerFile.read(rRegA);
      }
      else if (rRegA == RegReadASelect.R6) {
        return registerFile.read(rRegA);
      }
      else if (rRegA == RegReadASelect.R7) {
        return registerFile.read(rRegA);
      }
      else if (rRegA == RegReadASelect.Zero) {
        return 0;
      }
      else if (rRegA == RegReadASelect.PCNext) {
        return pcNext;
      }
      return 0;
    };
    const readB = () => {
      if (rRegB == RegReadBSelect.R0) {
        return registerFile.read(rRegB);
      }
      else if (rRegB == RegReadBSelect.R1) {
        return registerFile.read(rRegB);
      }
      else if (rRegB == RegReadBSelect.R2) {
        return registerFile.read(rRegB);
      }
      else if (rRegB == RegReadBSelect.R3) {
        return registerFile.read(rRegB);
      }
      else if (rRegB == RegReadBSelect.R4) {
        return registerFile.read(rRegB);
      }
      else if (rRegB == RegReadBSelect.R5) {
        return registerFile.read(rRegB);
      }
      else if (rRegB == RegReadBSelect.R6) {
        return registerFile.read(rRegB);
      }
      else if (rRegB == RegReadBSelect.R7) {
        return registerFile.read(rRegB);
      }
      else if (rRegB == RegReadBSelect.Imm) {
        return immediate;
      }
      return 0;
    };
    const branchController = () => {
      const flagZ = (prevFlag & FlagZMask) == FlagZMask;
      const flagS = (prevFlag & FlagSMask) == FlagSMask;
      const flagV = (prevFlag & FlagVMask) == FlagVMask;
      if (branchCondition == BranchCondition.Never) {
        return false;
      }
      else if (branchCondition == BranchCondition.Always) {
        return true;
      }
      else if (branchCondition == BranchCondition.IfZ) {
        return flagZ;
      }
      else if (branchCondition == BranchCondition.IfSV) {
        return flagS !== flagV;
      }
      else if (branchCondition == BranchCondition.IfSVorZ) {
        return flagZ || (flagS !== flagV);
      }
      else if (branchCondition == BranchCondition.IfNotZ) {
        return !flagZ;
      }
      return false;
    };

    const isBranching = branchController();

    const SignMask = 0x8000;
    const CarryMask = 0x10000;
    const Value16bitMask = 0xffff;

    const aValue = readA();
    const aSign = (aValue & SignMask) == SignMask;
    const bValue = readB();
    const bSign = (bValue & SignMask) == SignMask;

    if (aluOpcode === ALUOpcode.ADD) {
      const rawValue = aValue + bValue;
      const carry = (rawValue & CarryMask) == CarryMask;
      const value = rawValue & Value16bitMask;
      const vSign = (value & SignMask) == SignMask;
      const flag = EWRegister.createFlag(vSign, value == 0, carry, (aSign === bSign) && (bSign !== vSign));
      return {
        isBranching,
        flag,
        value,
        wReg,
      };
    }
    else if (aluOpcode == ALUOpcode.SUB) {
      const negBValue = (-bValue & Value16bitMask);
      const rawValue = aValue + negBValue;
      const carry = (rawValue & CarryMask) == CarryMask;
      const value = rawValue & Value16bitMask;
      const vSign = (value & SignMask) == SignMask;
      const flag = EWRegister.createFlag(vSign, value == 0, carry, (aSign !== bSign) && (bSign === vSign));
      return {
        isBranching,
        flag,
        value,
        wReg,
      };
    }
    else if (aluOpcode == ALUOpcode.AND) {
      const value = aValue & bValue;
      const vSign = (value & SignMask) == SignMask;
      const flag = EWRegister.createFlag(vSign, value == 0, false, false);
      return {
        isBranching,
        flag,
        value,
        wReg,
      };
    }
    else if (aluOpcode == ALUOpcode.OR) {
      const value = aValue | bValue;
      const vSign = (value & SignMask) == SignMask;
      const flag = EWRegister.createFlag(vSign, value == 0, false, false);
      return {
        isBranching,
        flag,
        value,
        wReg,
      };
    }
    else if (aluOpcode == ALUOpcode.XOR) {
      const value = aValue ^ bValue;
      const vSign = (value & SignMask) == SignMask;
      const flag = EWRegister.createFlag(vSign, value == 0, false, false);
      return {
        isBranching,
        flag,
        value,
        wReg,
      };
    }
    else if (aluOpcode == ALUOpcode.SLL) {
      const rawValue = aValue << bValue;
      const carry = (rawValue & CarryMask) == CarryMask;
      const value = rawValue & Value16bitMask;
      const vSign = (value & SignMask) == SignMask;
      const flag = EWRegister.createFlag(vSign, value == 0, carry, false);
      return {
        isBranching,
        flag,
        value,
        wReg,
      };
    }
    else if (aluOpcode == ALUOpcode.SLR) {
      const value = ((aValue << bValue) & Value16bitMask) | ((aValue & Value16bitMask) >>> (16 - bValue));
      const vSign = (value & SignMask) == SignMask;
      const flag = EWRegister.createFlag(vSign, value == 0, false, false);
      return {
        isBranching,
        flag,
        value,
        wReg,
      };
    }
    else if (aluOpcode == ALUOpcode.SRL) {
      const rawValue = aValue >>> bValue;
      const carry = ((rawValue >>> (bValue - 1)) & 1) == 1;
      const value = rawValue & Value16bitMask;
      const vSign = (value & SignMask) == SignMask;
      const flag = EWRegister.createFlag(vSign, value == 0, carry, false);
      return {
        isBranching,
        flag,
        value,
        wReg,
      };
    }
    else if (aluOpcode == ALUOpcode.SRA) {
      const rawValue = aValue >> bValue;
      const carry = ((rawValue >>> (bValue - 1)) & 1) == 1;
      const value = rawValue & Value16bitMask;
      const vSign = (value & SignMask) == SignMask;
      const flag = EWRegister.createFlag(vSign, value == 0, carry, false);
      return {
        isBranching,
        flag,
        value,
        wReg,
      };
    }

    // Invalid ALU Opcode
    return {
      isBranching: false,
      flag: 0,
      value: 0,
      wReg: RegWriteSelect.Ignore,
    };
  }

  writeBackPhase(wReg: number, dataRegister: number, finflag: boolean, registerFile: RegisterFile, outputRegister: OutputRegister) {
    if (wReg == RegWriteSelect.R0) {
      const newOutputRegister = new OutputRegister(outputRegister.output, outputRegister.finFlag || finflag);
      const newRegisterFile = RegisterFile.write(registerFile, wReg, dataRegister);
      return {
        newRegisterFile,
        newOutputRegister,
      }
    }
    else if (wReg == RegWriteSelect.R1) {
      const newOutputRegister = new OutputRegister(outputRegister.output, outputRegister.finFlag || finflag);
      const newRegisterFile = RegisterFile.write(registerFile, wReg, dataRegister);
      return {
        newRegisterFile,
        newOutputRegister,
      }
    }
    else if (wReg == RegWriteSelect.R2) {
      const newOutputRegister = new OutputRegister(outputRegister.output, outputRegister.finFlag || finflag);
      const newRegisterFile = RegisterFile.write(registerFile, wReg, dataRegister);
      return {
        newRegisterFile,
        newOutputRegister,
      }
    }
    else if (wReg == RegWriteSelect.R3) {
      const newOutputRegister = new OutputRegister(outputRegister.output, outputRegister.finFlag || finflag);
      const newRegisterFile = RegisterFile.write(registerFile, wReg, dataRegister);
      return {
        newRegisterFile,
        newOutputRegister,
      }
    }
    else if (wReg == RegWriteSelect.R4) {
      const newOutputRegister = new OutputRegister(outputRegister.output, outputRegister.finFlag || finflag);
      const newRegisterFile = RegisterFile.write(registerFile, wReg, dataRegister);
      return {
        newRegisterFile,
        newOutputRegister,
      }
    }
    else if (wReg == RegWriteSelect.R5) {
      const newOutputRegister = new OutputRegister(outputRegister.output, outputRegister.finFlag || finflag);
      const newRegisterFile = RegisterFile.write(registerFile, wReg, dataRegister);
      return {
        newRegisterFile,
        newOutputRegister,
      }
    }
    else if (wReg == RegWriteSelect.R6) {
      const newOutputRegister = new OutputRegister(outputRegister.output, outputRegister.finFlag || finflag);
      const newRegisterFile = RegisterFile.write(registerFile, wReg, dataRegister);
      return {
        newRegisterFile,
        newOutputRegister,
      }
    }
    else if (wReg == RegWriteSelect.R7) {
      const newOutputRegister = new OutputRegister(outputRegister.output, outputRegister.finFlag || finflag);
      const newRegisterFile = RegisterFile.write(registerFile, wReg, dataRegister);
      return {
        newRegisterFile,
        newOutputRegister,
      }
    }
    else if (wReg == RegWriteSelect.OUT) {
      const newOutputRegister = new OutputRegister(dataRegister, outputRegister.finFlag || finflag);
      return {
        newRegisterFile: registerFile,
        newOutputRegister,
      }
    }
    const newOutputRegister = new OutputRegister(outputRegister.output, outputRegister.finFlag || finflag);
    return {
      newRegisterFile: registerFile,
      newOutputRegister,
    };
  }
}

// everything


interface State {
  memory: Memory;
  registerFile: RegisterFile;
  fdRegister: FDRegister;
  deRegister: DERegister;
  ewRegister: EWRegister;
  outputRegister: OutputRegister;
  phaseCounter: PhaseCounter;
  core: Core;
}

class Home extends React.Component<{}, State> {
  mifFileInput = React.createRef<HTMLInputElement>();
  memAddressInput = React.createRef<HTMLInputElement>();
  constructor(props: {}) {
    super(props)
    this.state = Home.initialState();
  }

  static initialState = () => ({
    memory: new Memory([], 0),
    registerFile: new RegisterFile(),
    fdRegister: new FDRegister(),
    deRegister: new DERegister(),
    ewRegister: new EWRegister(),
    outputRegister: new OutputRegister(),
    phaseCounter: new NormalPhaseCounter(),
    core: new Core(),
  });

  handleUploadMif = () => {
    const input = this.mifFileInput.current;
    if (!input) {
      return;
    }
    const files = input.files;
    if (!files || !files[0]) {
      return;
    }
    files[0].text().then(content => {
      const memory = Memory.importFromMif(content);
      if (memory) {
        this.setState({ memory });
      }
      input.value = "";
    })
  }

  onChangeMemAddressDown = () => {
    this.setState(state => ({ memory: Memory.onChangeMemAddressRelative(state.memory, -0x10) }))
  }

  onChangeMemAddressUp = () => {
    this.setState(state => ({ memory: Memory.onChangeMemAddressRelative(state.memory, +0x10) }))
  }

  stepExecute = () => {
    this.setState(state => {
      return state.core.main(state.memory, state.registerFile, state.fdRegister, state.deRegister, state.ewRegister, state.outputRegister, state.phaseCounter);
    })
  }

  runUntilFinish = () => {
    this.setState(state => {
      const core = state.core;
      let newState = state;
      while(!newState.outputRegister.finFlag) {
        const value = core.main(newState.memory, newState.registerFile, newState.fdRegister, newState.deRegister, newState.ewRegister, newState.outputRegister, newState.phaseCounter);
        newState = {...value, core};
      }
      return newState;
    })
  }

  resetState = () => {
    this.setState(Home.initialState());
  }

  render() {
    return (
      <main className={styles.main}>
        <Grid container direction="row" spacing={2} style={{ flexGrow: 1 }}>
          <Grid item xs={2}>
            <Box className={styles.card}>
              <h2>
                Memory Viewer
              </h2>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Button variant="outlined" onClick={this.onChangeMemAddressDown}>&lt;</Button>
                </Grid>
                <Grid item style={{ margin: 'auto 0' }}>
                  <span>{this.state.memory.getMemoryViewAddress()}</span>
                  {/* <TextField label="Address" variant="outlined" ref={this.memAddressInput} onChange={this.onChangeMemAddress} /> */}
                </Grid>
                <Grid>
                  <Button variant="outlined" onClick={this.onChangeMemAddressUp}>&gt;</Button>
                </Grid>
              </Grid>
              {this.state.memory.getMemoryView().map(([index, data]) => (
                <p key={index} style={{ fontFamily: 'monospace' }}>
                  {index} : {data} {(to16bitHex(this.state.fdRegister.pc) == index) ? '←' : ''}
                </p>
              ))}
            </Box>
          </Grid>
          <Grid item xs={10} style={{ flexGrow: 1 }}>
            <Grid container spacing={2} style={{ height: '70%', marginBottom: '1rem' }}>
              <Grid item xs={12}>
                <Box className={styles.card}>
                  <Grid container justifyContent="space-around">
                    <Grid item>
                      {this.state.phaseCounter.isFetchInstructionPhase() ? '[' : ''}Phase 0{this.state.phaseCounter.isFetchInstructionPhase() ? ']' : ''}
                    </Grid>
                    <Grid item>
                      FDRegister
                    </Grid>
                    <Grid item>
                      {this.state.phaseCounter.isDecodeInstructionPhase() ? '[' : ''}Phase 1{this.state.phaseCounter.isDecodeInstructionPhase() ? ']' : ''}
                    </Grid>
                    <Grid item>
                      DERegister
                    </Grid>
                    <Grid item>
                      {this.state.phaseCounter.isExecutePhase() ? '[' : ''}Phase 2{this.state.phaseCounter.isExecutePhase() ? ']' : ''}
                    </Grid>
                    <Grid item>
                      EWRegister
                    </Grid>
                    <Grid item>
                      {this.state.phaseCounter.isWriteBackPhase() ? '[' : ''}Phase 3{this.state.phaseCounter.isWriteBackPhase() ? ']' : ''}
                    </Grid>
                  </Grid>
                  <Grid container justifyContent="space-around">
                    <Grid item>
                      <Box className={styles.devices}>
                        PC<br />
                        {to16bitHex(this.state.fdRegister.pc)}
                      </Box>
                      <Box className={styles.devices}>
                        Memory
                      </Box>
                    </Grid>
                    <Grid item>
                      <Box className={styles.devices}>
                        PCNext<br />
                        {to16bitHex(this.state.fdRegister.nextPC)}
                      </Box>
                      <Box className={styles.devices}>
                        IR<br />
                        {to16bitHex(this.state.fdRegister.instructionRegister)}
                      </Box>
                    </Grid>
                    <Grid item>
                      <Box className={styles.devices}>
                        Decoder
                      </Box>
                    </Grid>
                    <Grid item>
                      <Box className={styles.devices}>
                        Branch<br />
                        {to16bitHex(this.state.deRegister.branchCondition)}
                      </Box>
                      <Box className={styles.devices}>
                        ALUOp<br />
                        {to16bitHex(this.state.deRegister.aluOpcode)}
                      </Box>
                      <Box className={styles.devices}>
                        PCNext<br />
                        {to16bitHex(this.state.deRegister.nextPC)}
                      </Box>
                      <Box className={styles.devices}>
                        rRegA<br />
                        {to16bitHex(this.state.deRegister.readRegisterASelect)}
                      </Box>
                      <Box className={styles.devices}>
                        rRegB<br />
                        {to16bitHex(this.state.deRegister.readRegisterBSelect)}
                      </Box>
                      <Box className={styles.devices}>
                        Imm<br />
                        {to16bitHex(this.state.deRegister.immediate)}
                      </Box>
                      <Box className={styles.devices}>
                        wReg<br />
                        {to16bitHex(this.state.deRegister.writeRegisterSelect)}
                      </Box>
                    </Grid>
                    <Grid item>
                      <Box className={styles.devices}>
                        ALU
                      </Box>
                      <Box className={styles.devices}>
                        Branch
                      </Box>
                    </Grid>
                    <Grid item>
                      <Box className={styles.devices}>
                        isBranch<br />
                        {this.state.ewRegister.isBranching.toString()}
                      </Box>
                      <Box className={styles.devices}>
                        Flags<br />
                        {to16bitHex(this.state.ewRegister.flags)}
                      </Box>
                      <Box className={styles.devices}>
                        DR<br />
                        {to16bitHex(this.state.ewRegister.dataRegister)}
                      </Box>
                      <Box className={styles.devices}>
                        wReg<br />
                        {to16bitHex(this.state.ewRegister.writeRegisterSelect)}
                      </Box>
                    </Grid>
                    <Grid item>
                      <Box className={styles.devices}>
                        Register
                      </Box>
                      <Box className={styles.devices}>
                        Output<br />
                        {to16bitHex(this.state.outputRegister.output)}
                      </Box>
                      <Box className={styles.devices}>
                        finflag<br />
                        {this.state.outputRegister.finFlag.toString()}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{ height: '30%' }}>
              <Grid item xs={6}>
                <Box className={styles.card}>
                  <h2>Control</h2>
                  <p>
                    <Button variant="contained" component="span" size="small" onClick={this.stepExecute}>
                      Step Execute
                    </Button>
                    <Button variant="contained" component="span" size="small" onClick={this.runUntilFinish}>
                      Run
                    </Button>
                  </p>
                  <p>
                    <label htmlFor="upload-file">
                      <HiddenInput id="upload-file" type="file" ref={this.mifFileInput} onChange={this.handleUploadMif} />
                      <Button variant="contained" component="span" size="small">
                        load mif to memory
                      </Button>
                    </label>
                  </p>
                  <p>
                    <Button variant="contained" component="span" color="error" size="small" onClick={this.resetState}>
                      Reset All State
                    </Button>
                  </p>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box className={styles.card}>
                  <Grid container justifyContent="space-around">
                    <Grid item>
                      {Array.from({length: 4}, (_, x) => x).map(i => (
                        <p key={i}>
                          R{i}: {this.state.registerFile.readHex(i)}
                        </p>
                      ))}
                    </Grid>
                    <Grid item>
                      {Array.from({length: 4}, (_, x) => x + 4).map(i => (
                        <p key={i}>
                          R{i}: {this.state.registerFile.readHex(i)}
                        </p>
                      ))}
                    </Grid>
                    <Grid item>
                      <p>PC: {to16bitHex(this.state.fdRegister.pc)}</p>
                      <p>IR: {to16bitHex(this.state.fdRegister.instructionRegister)}</p>
                      <p>DR: {to16bitHex(this.state.ewRegister.dataRegister)}</p>
                      <p>flags: {this.state.ewRegister.showFlag()}</p>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </main>
    )
  }
}

export default Home
