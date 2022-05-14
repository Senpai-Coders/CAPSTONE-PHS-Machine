import Layout from '../components/layout'

const analysis = () => {
  return (
    <div>analysis</div>
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