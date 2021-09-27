import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AppBar, Toolbar, Typography } from '@mui/material'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
  <div className={styles.container}>
    <Head>
      <title>Create Next App</title>
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
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
