import Layout from '../components/layout'

const configuration = () => {
  return (
    <div>configuration</div>
  )
}

configuration.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
  }

export default configuration