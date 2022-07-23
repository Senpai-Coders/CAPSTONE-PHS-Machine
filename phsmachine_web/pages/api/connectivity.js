
const handler = async (req, res) => {
    res.status(200).json({ connectivity : "ok", server_name : "PHS NextJs Server" });
};

export default handler;
