import formidable from "formidable"
import fs from "fs"
import dbConnect from "../../../configs/dbConnection"

const users = require('../../../models/user')

dbConnect();

export const config = { api: { bodyParser: false } };

const post = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      const { uid } = fields
      const photoURL = await saveFile(files.file);

      const updatePhoto = await users.updateOne({_id : uid}, {$set : { photo : photoURL }})
      console.log(uid, updatePhoto)

      return res.status(201).json({status : 'ok', url : photoURL});
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({status : 'Internal Server Error'});
  }
};

const saveFile = async (file) => {
  const data = fs.readFileSync(file.filepath);
  var pattern = /(?:\.([^.]+))?$/;
  const extension = pattern.exec(file.originalFilename)[0];
  const filename = `${file.newFilename}${extension}`
  fs.writeFileSync(`./public/images/${filename}`, data);
  fs.unlinkSync(file.filepath);
  return `/images/${filename}`;
};

export default (req, res) => {
  req.method === "POST"
    ? post(req, res)
    : req.method === "PUT"
    ? console.log("PUT")
    : req.method === "DELETE"
    ? console.log("DELETE")
    : req.method === "GET"
    ? console.log("GET")
    : res.status(404).send("");
};
