
const handler = async (req, res) => {
    try {
        const { target_io } = req.body

        res.status(200).json({
            target_io,
            status : "toggled 👌"
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Error 😥'
        })
    }
}

export default handler;