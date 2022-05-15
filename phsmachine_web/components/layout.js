import Head from 'next/head'
import Sidebar from './sidebar'

export default function Layout({ children }) {
    return (
        <>
            <Head>
                <title>Layouts Example</title>
            </Head>
            <div className='flex relative h-screen '>
                <Sidebar />
                <main className='w-full h-full card'>{children}</main>
            </div>
        </>
    )
}
