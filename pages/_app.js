import { GlobalContextProvider } from '../context/global-context'
import '../styles/styles.css'

function MyApp({ Component, pageProps }) {
  return (
    <GlobalContextProvider>
      <Component {...pageProps} />
    </GlobalContextProvider>
  )
}

export default MyApp
