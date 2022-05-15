import Layout from '../components/layout'

const analysis = () => {
    return (
        <>
            <div className='p-10'>
                <p className='text-xl card-title font-lato font-semibold'>Analysis</p>
            </div>
        </>
    )
}

analysis.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default analysis