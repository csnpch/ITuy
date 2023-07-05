import type { AppProps } from 'next/app'
// Store
import { Provider } from 'react-redux'
import { store } from '@/store'
// Components
import VerifyAuth from "@/components/auth/VerifyAuth"

// Style
import '@/assets/css/globals.css'
import 'react-medium-image-zoom/dist/styles.css'
// Antd
import 'antd/dist/reset.css';
// Font Awesome
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false


export default function App({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <VerifyAuth />
            <Component {...pageProps} />
        </Provider>
    )
}
