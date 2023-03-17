import React from 'react'
import { AppProps } from 'next/app'
import '../styles/globals.css'
import NavBar from '../components/NavBar'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
  <>
    <NavBar/>
    <Component {...pageProps} />
  </>
  )
};

export default MyApp;
