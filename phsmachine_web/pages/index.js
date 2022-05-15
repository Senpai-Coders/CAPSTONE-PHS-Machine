import Layout from '../components/layout'

export default function Home() {
    return (
        <>
            <div className='p-10'>
                <h1 className='text-xl card-title font-lato font-semibold'>Detection</h1>
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