import Layout from '../components/layout'

export default function Home() {
    return (
        <>FaThermometerFull
            <div className=''>
                <p className='text-rose-800 text-4xl font-mono'>Hi welcome to PHS</p>
            </div>
        </>
    )
}

Home.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}