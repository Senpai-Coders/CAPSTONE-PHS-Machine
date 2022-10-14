const mongoose = require("mongoose");
let ObjectId = mongoose.Types.ObjectId;

const configSchema = new mongoose.Schema({
  schema_v: { type: Number, default: 1 },
  category: { type: String, required: true },
  config_name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  value: { type: mongoose.Mixed, required: true },
  cat: { type: Date, default: Date.now },
  uat: { type: Date, default: Date.now },
  uby: { type: mongoose.ObjectId, default : new ObjectId("6277e36f94637471bdabb80d") },
  disabled: { type: Boolean, default: false },
  deletable : { type: Boolean, default : true}
});

module.exports =
  mongoose.models.config || mongoose.model("config", configSchema);
