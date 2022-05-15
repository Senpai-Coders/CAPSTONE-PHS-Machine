import '../styles/globals.css'
import { loadTheme, setTheme } from "../helpers"

import { useEffect } from "react"

function MyApp({ Component, pageProps }) {
    const getLayout = Component.getLayout || ((page) => page)

    useEffect(()=>{
        loadTheme()
    })

    return getLayout(<Component {...pageProps} />)
}

export default MyApp
