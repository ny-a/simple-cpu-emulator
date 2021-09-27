(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{2562:function(e,t,i){"use strict";i.r(t);var r=i(8152),n=i(7326),s=i(136),a=i(6215),c=i(1120),o=i(5671),l=i(3144),u=i(4942),d=i(5725),h=i(4899),g=i(3264),f=i(1936),m=i(4476),v=i.n(m),R=i(7294),p=i(5893);function x(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),i.push.apply(i,r)}return i}function w(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?x(Object(i),!0).forEach((function(t){(0,u.Z)(e,t,i[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):x(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}function Z(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var i,r=(0,c.Z)(e);if(t){var n=(0,c.Z)(this).constructor;i=Reflect.construct(r,arguments,n)}else i=r.apply(this,arguments);return(0,a.Z)(this,i)}}var j=(0,g.Z)("input")({display:"none"}),y=function(e){return"0x"+e.toString(16).padStart(4,"0")},P=function(){function e(){var t=this,i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;(0,o.Z)(this,e),(0,u.Z)(this,"data",void 0),(0,u.Z)(this,"size",void 0),(0,u.Z)(this,"memoryViewAddress",void 0),(0,u.Z)(this,"alignMemAddress",(function(e){return e<0?e+t.size&65520:t.size-16<e?e-t.size&65520:65520&e})),this.data=i,this.size=r,this.memoryViewAddress=n}return(0,l.Z)(e,[{key:"read",value:function(e){return this.data[e]||0}},{key:"getMemoryView",value:function(){var e=this;return this.data.slice(this.memoryViewAddress,this.memoryViewAddress+16).map((function(t,i){return[y(e.memoryViewAddress+i),y(t)]}))}},{key:"getMemoryViewAddress",value:function(){return y(this.memoryViewAddress)}}],[{key:"importFromMif",value:function(t){var i=t.split("\n"),r=i.indexOf("CONTENT BEGIN");if(-1!=r){var n=i.slice(0,r),s=parseInt(e.parseMifHeader(n.find((function(e){return e.startsWith("WIDTH")})),"16")),a=parseInt(e.parseMifHeader(n.find((function(e){return e.startsWith("DEPTH")})),"4096")),c=e.parseMifHeader(n.find((function(e){return e.startsWith("ADDRESS_RADIX")})),"DEC"),o=e.parseMifHeader(n.find((function(e){return e.startsWith("DATA_RADIX")})),"DEC");if(16==s)if("DEC"==c){if("DEC"==o){var l=i.slice(r+1,r+a+1).map((function(t){return e.parseMifContent(t,s)}));return new e(l,a)}console.error("Not Implemented: DATA_RADIX in mif file should be DEC.")}else console.error("Not Implemented: ADDRESS_RADIX in mif file should be DEC.");else console.error("Not Implemented: WIDTH in mif file should be 16.")}else console.error("Data Error: CONTENT BEGIN is not found.")}},{key:"parseMifHeader",value:function(e,t){if(!e)return t;var i=e.indexOf("=");return e.slice(i+1,-1).trim()}},{key:"parseMifContent",value:function(e,t){var i=parseInt(e.slice(e.indexOf(":")+1,-1).trim());return 0<=i?i:i+(1<<t)}}]),e}();(0,u.Z)(P,"onChangeMemAddressRelative",(function(e,t){var i=e.alignMemAddress(e.memoryViewAddress+t);return new P(e.data,e.size,i)})),(0,u.Z)(P,"onChangeMemAddressAbsolute",(function(e,t){var i=e.alignMemAddress(t);return new P(e.data,e.size,i)}));var C=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0;(0,o.Z)(this,e),(0,u.Z)(this,"data",Array(8).fill(0)),t&&(this.data=t)}return(0,l.Z)(e,[{key:"read",value:function(e){return this.data[e]}},{key:"readHex",value:function(e){return y(this.data[e]||0)}}],[{key:"write",value:function(t,i,r){var n=t.data;return n[i]=r,new e(n)}}]),e}(),F=function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;(0,o.Z)(this,e),(0,u.Z)(this,"instructionRegister",void 0),(0,u.Z)(this,"pc",void 0),(0,u.Z)(this,"nextPC",void 0),this.instructionRegister=t,this.pc=i,this.nextPC=r},N=function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,s=arguments.length>4&&void 0!==arguments[4]?arguments[4]:0,a=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0,c=arguments.length>6&&void 0!==arguments[6]?arguments[6]:0,l=arguments.length>7&&void 0!==arguments[7]&&arguments[7];(0,o.Z)(this,e),(0,u.Z)(this,"readRegisterASelect",void 0),(0,u.Z)(this,"readRegisterBSelect",void 0),(0,u.Z)(this,"writeRegisterSelect",void 0),(0,u.Z)(this,"immediate",void 0),(0,u.Z)(this,"aluOpcode",void 0),(0,u.Z)(this,"branchCondition",void 0),(0,u.Z)(this,"nextPC",void 0),(0,u.Z)(this,"finflag",void 0),this.readRegisterASelect=t,this.readRegisterBSelect=i,this.writeRegisterSelect=r,this.immediate=n,this.aluOpcode=s,this.branchCondition=a,this.nextPC=c,this.finflag=l},A=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=arguments.length>2&&void 0!==arguments[2]&&arguments[2],n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,s=arguments.length>4&&void 0!==arguments[4]&&arguments[4];(0,o.Z)(this,e),(0,u.Z)(this,"writeRegisterSelect",void 0),(0,u.Z)(this,"dataRegister",void 0),(0,u.Z)(this,"isBranching",void 0),(0,u.Z)(this,"flags",void 0),(0,u.Z)(this,"finflag",void 0),this.writeRegisterSelect=t,this.dataRegister=i,this.isBranching=r,this.flags=n,this.finflag=s}return(0,l.Z)(e,[{key:"isFlagS",value:function(){return 0!=(8&this.flags)}},{key:"isFlagZ",value:function(){return 0!=(4&this.flags)}},{key:"isFlagC",value:function(){return 0!=(2&this.flags)}},{key:"isFlagV",value:function(){return 0!=(1&this.flags)}},{key:"showFlag",value:function(){return(this.isFlagS()?"S":"-")+(this.isFlagZ()?"Z":"-")+(this.isFlagC()?"C":"-")+(this.isFlagV()?"V":"-")}}],[{key:"createFlag",value:function(e,t,i,r){return(e?8:0)+(t?4:0)+(i?2:0)+(r?1:0)}}]),e}(),b=function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,i=arguments.length>1&&void 0!==arguments[1]&&arguments[1];(0,o.Z)(this,e),(0,u.Z)(this,"output",void 0),(0,u.Z)(this,"finFlag",void 0),this.output=t,this.finFlag=i},O=function(e){(0,s.Z)(i,e);var t=Z(i);function i(){var e,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;return(0,o.Z)(this,i),e=t.call(this),(0,u.Z)((0,n.Z)(e),"data",0),e.data=r,e}return(0,l.Z)(i,[{key:"read",value:function(){return this.data}},{key:"isFetchInstructionPhase",value:function(){return 0==this.data}},{key:"isDecodeInstructionPhase",value:function(){return 1==this.data}},{key:"isExecutePhase",value:function(){return 2==this.data}},{key:"isWriteBackPhase",value:function(){return 3==this.data}},{key:"hasNext",value:function(){return!0}}],[{key:"next",value:function(e){var t=e.data+1;return new i(4<=t?0:t)}}]),i}(function(){function e(){(0,o.Z)(this,e)}return(0,l.Z)(e,[{key:"isFetchInstructionPhase",value:function(){return!1}},{key:"isDecodeInstructionPhase",value:function(){return!1}},{key:"isExecutePhase",value:function(){return!1}},{key:"isWriteBackPhase",value:function(){return!1}},{key:"hasNext",value:function(){return!1}}]),e}()),B=0,k=16384,S=32768,D=49152,E=0,I=8192,M=14336,_=0,V=256,W=512,z=768,H=0,T=16,U=32,X=48,G=64,L=80,q=96,J=128,K=144,Q=160,Y=176,$=192,ee=208,te=240,ie=65520,re=14336,ne=11,se=1792,ae=0,ce=1,oe=2,le=3,ue=4,de=5,he=6,ge=7,fe=8,me=9,ve=0,Re=1,pe=2,xe=3,we=4,Ze=5,je=6,ye=7,Pe=10,Ce=0,Fe=1,Ne=2,Ae=3,be=4,Oe=5,Be=6,ke=7,Se=8,De=15,Ee=0,Ie=1,Me=2,_e=3,Ve=4,We=5,ze=6,He=7,Te=8,Ue=0,Xe=1,Ge=2,Le=3,qe=4,Je=5,Ke=function(){function e(){(0,o.Z)(this,e)}return(0,l.Z)(e,[{key:"main",value:function(e,t,i,r,n,s,a){var c=i,o=r,l=n,u=s,d=t,h=a;if(a.isFetchInstructionPhase()){var g=this.instructionFetchPhase(c.nextPC,l.dataRegister,l.isBranching,e);c=new F(g.instruction,g.pc,g.pcNext)}if(a.isDecodeInstructionPhase()){var f=this.instructionDecodePhase(c.instructionRegister,c.nextPC);o=new N(f.rRegA,f.rRegB,f.wReg,f.imm,f.aluOpcode,f.branchCondition,f.pcNext,f.finflag)}if(a.isExecutePhase()){var m=this.executionPhase(o.branchCondition,o.aluOpcode,o.nextPC,o.readRegisterASelect,o.readRegisterBSelect,o.immediate,o.writeRegisterSelect,l.flags,t);l=new A(m.wReg,m.value,m.isBranching,m.flag,o.finflag)}if(a.isWriteBackPhase()){var v=this.writeBackPhase(l.writeRegisterSelect,l.dataRegister,l.finflag,t,u);d=v.newRegisterFile,u=v.newOutputRegister}return a instanceof O&&(h=O.next(a)),{memory:P.onChangeMemAddressAbsolute(e,c.pc),registerFile:d,fdRegister:c,deRegister:o,ewRegister:l,outputRegister:u,phaseCounter:h}}},{key:"instructionFetchPhase",value:function(e,t,i,r){var n=i?t:e;return{pc:n,pcNext:n+1&65535,instruction:r.read(n)}}},{key:"instructionDecodePhase",value:function(e,t){var i=!1,r=49152&e;if(r==B);else if(r==k);else if(r==S){var n=14336&e,s=255&e,a=(128==(128&s)?65408:0)+s;if(n==E)return{branchCondition:Ue,aluOpcode:Ee,pcNext:t,rRegA:fe,rRegB:Pe,imm:a,wReg:(1792&e)>>8,finflag:i};if(n==I)return{branchCondition:Xe,aluOpcode:Ee,pcNext:t,rRegA:me,rRegB:Pe,imm:a,wReg:Se,finflag:i};if(n==M){var c=1792&e;if(c==_)return{branchCondition:Ge,aluOpcode:Ee,pcNext:t,rRegA:me,rRegB:Pe,imm:a,wReg:Se,finflag:i};if(c==V)return{branchCondition:Le,aluOpcode:Ee,pcNext:t,rRegA:me,rRegB:Pe,imm:a,wReg:Se,finflag:i};if(c==W)return{branchCondition:qe,aluOpcode:Ee,pcNext:t,rRegA:me,rRegB:Pe,imm:a,wReg:Se,finflag:i};if(c==z)return{branchCondition:Je,aluOpcode:Ee,pcNext:t,rRegA:me,rRegB:Pe,imm:a,wReg:Se,finflag:i}}}else if(r==D){var o=240&e;if(o==H){var l=(e&se)>>8;return{branchCondition:Ue,aluOpcode:Ee,pcNext:t,rRegA:l,rRegB:(e&re)>>ne,imm:0,wReg:l,finflag:i}}if(o==T){var u=(e&se)>>8;return{branchCondition:Ue,aluOpcode:Ie,pcNext:t,rRegA:u,rRegB:(e&re)>>ne,imm:0,wReg:u,finflag:i}}if(o==U){var d=(e&se)>>8;return{branchCondition:Ue,aluOpcode:Me,pcNext:t,rRegA:d,rRegB:(e&re)>>ne,imm:0,wReg:d,finflag:i}}if(o==X){var h=(e&se)>>8;return{branchCondition:Ue,aluOpcode:_e,pcNext:t,rRegA:h,rRegB:(e&re)>>ne,imm:0,wReg:h,finflag:i}}if(o==G){var g=(e&se)>>8;return{branchCondition:Ue,aluOpcode:Ve,pcNext:t,rRegA:g,rRegB:(e&re)>>ne,imm:0,wReg:g,finflag:i}}if(o==L){return{branchCondition:Ue,aluOpcode:Ie,pcNext:t,rRegA:(e&se)>>8,rRegB:(e&re)>>ne,imm:0,wReg:Se,finflag:i}}if(o==q){return{branchCondition:Ue,aluOpcode:Ee,pcNext:t,rRegA:fe,rRegB:(e&re)>>ne,imm:0,wReg:(e&se)>>8,finflag:i}}if(o==J){var f=(e&se)>>8,m=15&e;return{branchCondition:Ue,aluOpcode:We,pcNext:t,rRegA:f,rRegB:Pe,imm:(8==(8&m)?ie:0)+m,wReg:f,finflag:i}}if(o==K){var v=(e&se)>>8,R=15&e;return{branchCondition:Ue,aluOpcode:ze,pcNext:t,rRegA:v,rRegB:Pe,imm:(8==(8&R)?ie:0)+R,wReg:v,finflag:i}}if(o==Q){var p=(e&se)>>8,x=15&e;return{branchCondition:Ue,aluOpcode:He,pcNext:t,rRegA:p,rRegB:Pe,imm:(8==(8&x)?ie:0)+x,wReg:p,finflag:i}}if(o==Y){var w=(e&se)>>8,Z=15&e;return{branchCondition:Ue,aluOpcode:Te,pcNext:t,rRegA:w,rRegB:Pe,imm:(8==(8&Z)?ie:0)+Z,wReg:w,finflag:i}}if(o==$);else{if(o==ee){return{branchCondition:Ue,aluOpcode:Ee,pcNext:t,rRegA:fe,rRegB:(e&re)>>ne,imm:0,wReg:De,finflag:i}}if(o==te){return{branchCondition:Xe,aluOpcode:Ee,pcNext:t,rRegA:me,rRegB:Pe,imm:65535,wReg:Se,finflag:!0}}}}return{branchCondition:Ue,aluOpcode:Ee,pcNext:t,rRegA:ae,rRegB:ve,imm:0,wReg:Se,finflag:i}}},{key:"executionPhase",value:function(e,t,i,r,n,s,a,c,o){var l=function(){var t=4==(4&c),i=8==(8&c),r=1==(1&c);return e!=Ue&&(e==Xe||(e==Ge?t:e==Le?i!==r:e==qe?t||i!==r:e==Je&&!t))}(),u=32768,d=65536,h=65535,g=r==ae||r==ce||r==oe||r==le||r==ue||r==de||r==he||r==ge?o.read(r):r==fe?0:r==me?i:0,f=(g&u)==u,m=n==ve||n==Re||n==pe||n==xe||n==we||n==Ze||n==je||n==ye?o.read(n):n==Pe?s:0,v=(m&u)==u;if(t===Ee){var R=g+m,p=(R&d)==d,x=R&h,w=(x&u)==u;return{isBranching:l,flag:A.createFlag(w,0==x,p,f===v&&v!==w),value:x,wReg:a}}if(t==Ie){var Z=g+(-m&h),j=(Z&d)==d,y=Z&h,P=(y&u)==u;return{isBranching:l,flag:A.createFlag(P,0==y,j,f!==v&&v===P),value:y,wReg:a}}if(t==Me){var C=g&m,F=(C&u)==u;return{isBranching:l,flag:A.createFlag(F,0==C,!1,!1),value:C,wReg:a}}if(t==_e){var N=g|m,b=(N&u)==u;return{isBranching:l,flag:A.createFlag(b,0==N,!1,!1),value:N,wReg:a}}if(t==Ve){var O=g^m,B=(O&u)==u;return{isBranching:l,flag:A.createFlag(B,0==O,!1,!1),value:O,wReg:a}}if(t==We){var k=g<<m,S=(k&d)==d,D=k&h,E=(D&u)==u;return{isBranching:l,flag:A.createFlag(E,0==D,S,!1),value:D,wReg:a}}if(t==ze){var I=g<<m&h|(g&h)>>>16-m,M=(I&u)==u;return{isBranching:l,flag:A.createFlag(M,0==I,!1,!1),value:I,wReg:a}}if(t==He){var _=g>>>m,V=1==(_>>>m-1&1),W=_&h,z=(W&u)==u;return{isBranching:l,flag:A.createFlag(z,0==W,V,!1),value:W,wReg:a}}if(t==Te){var H=g>>m,T=1==(H>>>m-1&1),U=H&h,X=(U&u)==u;return{isBranching:l,flag:A.createFlag(X,0==U,T,!1),value:U,wReg:a}}return{isBranching:!1,flag:0,value:0,wReg:Se}}},{key:"writeBackPhase",value:function(e,t,i,r,n){if(e==Ce){var s=new b(n.output,n.finFlag||i);return{newRegisterFile:C.write(r,e,t),newOutputRegister:s}}if(e==Fe){var a=new b(n.output,n.finFlag||i);return{newRegisterFile:C.write(r,e,t),newOutputRegister:a}}if(e==Ne){var c=new b(n.output,n.finFlag||i);return{newRegisterFile:C.write(r,e,t),newOutputRegister:c}}if(e==Ae){var o=new b(n.output,n.finFlag||i);return{newRegisterFile:C.write(r,e,t),newOutputRegister:o}}if(e==be){var l=new b(n.output,n.finFlag||i);return{newRegisterFile:C.write(r,e,t),newOutputRegister:l}}if(e==Oe){var u=new b(n.output,n.finFlag||i);return{newRegisterFile:C.write(r,e,t),newOutputRegister:u}}if(e==Be){var d=new b(n.output,n.finFlag||i);return{newRegisterFile:C.write(r,e,t),newOutputRegister:d}}if(e==ke){var h=new b(n.output,n.finFlag||i);return{newRegisterFile:C.write(r,e,t),newOutputRegister:h}}return e==De?{newRegisterFile:r,newOutputRegister:new b(t,n.finFlag||i)}:{newRegisterFile:r,newOutputRegister:new b(n.output,n.finFlag||i)}}}]),e}(),Qe=function(e){(0,s.Z)(i,e);var t=Z(i);function i(e){var r;return(0,o.Z)(this,i),r=t.call(this,e),(0,u.Z)((0,n.Z)(r),"mifFileInput",R.createRef()),(0,u.Z)((0,n.Z)(r),"memAddressInput",R.createRef()),(0,u.Z)((0,n.Z)(r),"handleUploadMif",(function(){var e=r.mifFileInput.current;if(e){var t=e.files;t&&t[0]&&t[0].text().then((function(t){var i=P.importFromMif(t);i&&r.setState({memory:i}),e.value=""}))}})),(0,u.Z)((0,n.Z)(r),"onChangeMemAddressDown",(function(){r.setState((function(e){return{memory:P.onChangeMemAddressRelative(e.memory,-16)}}))})),(0,u.Z)((0,n.Z)(r),"onChangeMemAddressUp",(function(){r.setState((function(e){return{memory:P.onChangeMemAddressRelative(e.memory,16)}}))})),(0,u.Z)((0,n.Z)(r),"stepExecute",(function(){r.setState((function(e){return e.core.main(e.memory,e.registerFile,e.fdRegister,e.deRegister,e.ewRegister,e.outputRegister,e.phaseCounter)}))})),(0,u.Z)((0,n.Z)(r),"runUntilFinish",(function(){r.setState((function(e){for(var t=e.core,i=e;!i.outputRegister.finFlag;){i=w(w({},t.main(i.memory,i.registerFile,i.fdRegister,i.deRegister,i.ewRegister,i.outputRegister,i.phaseCounter)),{},{core:t})}return i}))})),(0,u.Z)((0,n.Z)(r),"resetState",(function(){r.setState(i.initialState())})),r.state=i.initialState(),r}return(0,l.Z)(i,[{key:"render",value:function(){var e=this;return(0,p.jsx)("main",{className:v().main,children:(0,p.jsxs)(d.ZP,{container:!0,direction:"row",spacing:2,style:{flexGrow:1},children:[(0,p.jsx)(d.ZP,{item:!0,xs:2,children:(0,p.jsxs)(f.Z,{className:v().card,children:[(0,p.jsx)("h2",{children:"Memory Viewer"}),(0,p.jsxs)(d.ZP,{container:!0,justifyContent:"space-between",children:[(0,p.jsx)(d.ZP,{item:!0,children:(0,p.jsx)(h.Z,{variant:"outlined",onClick:this.onChangeMemAddressDown,children:"<"})}),(0,p.jsx)(d.ZP,{item:!0,style:{margin:"auto 0"},children:(0,p.jsx)("span",{children:this.state.memory.getMemoryViewAddress()})}),(0,p.jsx)(d.ZP,{children:(0,p.jsx)(h.Z,{variant:"outlined",onClick:this.onChangeMemAddressUp,children:">"})})]}),this.state.memory.getMemoryView().map((function(t){var i=(0,r.Z)(t,2),n=i[0],s=i[1];return(0,p.jsxs)("p",{style:{fontFamily:"monospace"},children:[n," : ",s," ",y(e.state.fdRegister.pc)==n?"\u2190":""]},n)}))]})}),(0,p.jsxs)(d.ZP,{item:!0,xs:10,style:{flexGrow:1},children:[(0,p.jsx)(d.ZP,{container:!0,spacing:2,style:{height:"70%",marginBottom:"1rem"},children:(0,p.jsx)(d.ZP,{item:!0,xs:12,children:(0,p.jsxs)(f.Z,{className:v().card,children:[(0,p.jsxs)(d.ZP,{container:!0,justifyContent:"space-around",children:[(0,p.jsxs)(d.ZP,{item:!0,children:[this.state.phaseCounter.isFetchInstructionPhase()?"[":"","Phase 0",this.state.phaseCounter.isFetchInstructionPhase()?"]":""]}),(0,p.jsx)(d.ZP,{item:!0,children:"FDRegister"}),(0,p.jsxs)(d.ZP,{item:!0,children:[this.state.phaseCounter.isDecodeInstructionPhase()?"[":"","Phase 1",this.state.phaseCounter.isDecodeInstructionPhase()?"]":""]}),(0,p.jsx)(d.ZP,{item:!0,children:"DERegister"}),(0,p.jsxs)(d.ZP,{item:!0,children:[this.state.phaseCounter.isExecutePhase()?"[":"","Phase 2",this.state.phaseCounter.isExecutePhase()?"]":""]}),(0,p.jsx)(d.ZP,{item:!0,children:"EWRegister"}),(0,p.jsxs)(d.ZP,{item:!0,children:[this.state.phaseCounter.isWriteBackPhase()?"[":"","Phase 3",this.state.phaseCounter.isWriteBackPhase()?"]":""]})]}),(0,p.jsxs)(d.ZP,{container:!0,justifyContent:"space-around",children:[(0,p.jsxs)(d.ZP,{item:!0,children:[(0,p.jsxs)(f.Z,{className:v().devices,children:["PC",(0,p.jsx)("br",{}),y(this.state.fdRegister.pc)]}),(0,p.jsx)(f.Z,{className:v().devices,children:"Memory"})]}),(0,p.jsxs)(d.ZP,{item:!0,children:[(0,p.jsxs)(f.Z,{className:v().devices,children:["PCNext",(0,p.jsx)("br",{}),y(this.state.fdRegister.nextPC)]}),(0,p.jsxs)(f.Z,{className:v().devices,children:["IR",(0,p.jsx)("br",{}),y(this.state.fdRegister.instructionRegister)]})]}),(0,p.jsx)(d.ZP,{item:!0,children:(0,p.jsx)(f.Z,{className:v().devices,children:"Decoder"})}),(0,p.jsxs)(d.ZP,{item:!0,children:[(0,p.jsxs)(f.Z,{className:v().devices,children:["Branch",(0,p.jsx)("br",{}),y(this.state.deRegister.branchCondition)]}),(0,p.jsxs)(f.Z,{className:v().devices,children:["ALUOp",(0,p.jsx)("br",{}),y(this.state.deRegister.aluOpcode)]}),(0,p.jsxs)(f.Z,{className:v().devices,children:["PCNext",(0,p.jsx)("br",{}),y(this.state.deRegister.nextPC)]}),(0,p.jsxs)(f.Z,{className:v().devices,children:["rRegA",(0,p.jsx)("br",{}),y(this.state.deRegister.readRegisterASelect)]}),(0,p.jsxs)(f.Z,{className:v().devices,children:["rRegB",(0,p.jsx)("br",{}),y(this.state.deRegister.readRegisterBSelect)]}),(0,p.jsxs)(f.Z,{className:v().devices,children:["Imm",(0,p.jsx)("br",{}),y(this.state.deRegister.immediate)]}),(0,p.jsxs)(f.Z,{className:v().devices,children:["wReg",(0,p.jsx)("br",{}),y(this.state.deRegister.writeRegisterSelect)]})]}),(0,p.jsxs)(d.ZP,{item:!0,children:[(0,p.jsx)(f.Z,{className:v().devices,children:"ALU"}),(0,p.jsx)(f.Z,{className:v().devices,children:"Branch"})]}),(0,p.jsxs)(d.ZP,{item:!0,children:[(0,p.jsxs)(f.Z,{className:v().devices,children:["isBranch",(0,p.jsx)("br",{}),this.state.ewRegister.isBranching.toString()]}),(0,p.jsxs)(f.Z,{className:v().devices,children:["Flags",(0,p.jsx)("br",{}),y(this.state.ewRegister.flags)]}),(0,p.jsxs)(f.Z,{className:v().devices,children:["DR",(0,p.jsx)("br",{}),y(this.state.ewRegister.dataRegister)]}),(0,p.jsxs)(f.Z,{className:v().devices,children:["wReg",(0,p.jsx)("br",{}),y(this.state.ewRegister.writeRegisterSelect)]})]}),(0,p.jsxs)(d.ZP,{item:!0,children:[(0,p.jsx)(f.Z,{className:v().devices,children:"Register"}),(0,p.jsxs)(f.Z,{className:v().devices,children:["Output",(0,p.jsx)("br",{}),y(this.state.outputRegister.output)]}),(0,p.jsxs)(f.Z,{className:v().devices,children:["finflag",(0,p.jsx)("br",{}),this.state.outputRegister.finFlag.toString()]})]})]})]})})}),(0,p.jsxs)(d.ZP,{container:!0,spacing:2,style:{height:"30%"},children:[(0,p.jsx)(d.ZP,{item:!0,xs:6,children:(0,p.jsxs)(f.Z,{className:v().card,children:[(0,p.jsx)("h2",{children:"Control"}),(0,p.jsxs)("p",{children:[(0,p.jsx)(h.Z,{variant:"contained",component:"span",size:"small",onClick:this.stepExecute,children:"Step Execute"}),(0,p.jsx)(h.Z,{variant:"contained",component:"span",size:"small",onClick:this.runUntilFinish,children:"Run"})]}),(0,p.jsx)("p",{children:(0,p.jsxs)("label",{htmlFor:"upload-file",children:[(0,p.jsx)(j,{id:"upload-file",type:"file",ref:this.mifFileInput,onChange:this.handleUploadMif}),(0,p.jsx)(h.Z,{variant:"contained",component:"span",size:"small",children:"load mif to memory"})]})}),(0,p.jsx)("p",{children:(0,p.jsx)(h.Z,{variant:"contained",component:"span",color:"error",size:"small",onClick:this.resetState,children:"Reset All State"})})]})}),(0,p.jsx)(d.ZP,{item:!0,xs:6,children:(0,p.jsx)(f.Z,{className:v().card,children:(0,p.jsxs)(d.ZP,{container:!0,justifyContent:"space-around",children:[(0,p.jsx)(d.ZP,{item:!0,children:Array.from({length:4},(function(e,t){return t})).map((function(t){return(0,p.jsxs)("p",{children:["R",t,": ",e.state.registerFile.readHex(t)]},t)}))}),(0,p.jsx)(d.ZP,{item:!0,children:Array.from({length:4},(function(e,t){return t+4})).map((function(e){return e+4})).map((function(t){return(0,p.jsxs)("p",{children:["R",t,": ",e.state.registerFile.readHex(t)]},t)}))}),(0,p.jsxs)(d.ZP,{item:!0,children:[(0,p.jsxs)("p",{children:["PC: ",y(this.state.fdRegister.pc)]}),(0,p.jsxs)("p",{children:["IR: ",y(this.state.fdRegister.instructionRegister)]}),(0,p.jsxs)("p",{children:["DR: ",y(this.state.ewRegister.dataRegister)]}),(0,p.jsxs)("p",{children:["flags: ",this.state.ewRegister.showFlag()]})]})]})})})]})]})]})})}}]),i}(R.Component);(0,u.Z)(Qe,"initialState",(function(){return{memory:new P([],0),registerFile:new C,fdRegister:new F,deRegister:new N,ewRegister:new A,outputRegister:new b,phaseCounter:new O,core:new Ke}})),t.default=Qe},5301:function(e,t,i){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return i(2562)}])}},function(e){e.O(0,[569,774,888,179],(function(){return t=5301,e(e.s=t);var t}));var t=e.O();_N_E=t}]);