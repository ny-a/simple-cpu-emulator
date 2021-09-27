import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AppBar, Toolbar, Typography } from '@mui/material'

function MyApp({ Component, pageProps }: AppProps) {
  return (<div>
    <AppBar position="static">
      <Toolbar variant="dense">
        <Typography variant="h6" color="inherit" component="div">
          SIMPLE Emulator
        </Typography>
      </Toolbar>
    </AppBar>
    <Component {...pageProps} />
  </div>
  )
}
export default MyApp
