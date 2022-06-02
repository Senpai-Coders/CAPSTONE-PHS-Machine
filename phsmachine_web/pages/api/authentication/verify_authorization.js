import { VERIFY_AUTHORIZATION } from "../../../helpers/api/index"

const handler = async (req, res) => {
    try {
        const { auth } = req.query
        const data = VERIFY_AUTHORIZATION(auth)
        res.status(200).json({
            value : data !== false,
            data
        })
    } catch (e) {
        res.status(500).json({
            value : false,
            message: 'Error 😥'
        })
    }
}

export default handler;