const cookie = require("cookie")

const handler = async (req, res) => {
    try {
        //create a COOKIE
        res.setHeader("Set-Cookie", cookie.serialize("authorization", {}, {
            httpOnly : true,
            secure : process.env.NODE_ENV !== "development",
            expires : new Date(0),
            sameSite : "strict",
            path : "/"
        }))

        res.status(200).json({
            message : "Signed Out 👌"
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: `Error 😥`
        })
    }
}

export default handler;