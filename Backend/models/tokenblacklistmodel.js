import mongoose from "mongoose";


const blacklisttSchema = new mongoose.Schema(
    {
    token: {
      type: String,
      required: true
    }
  },
    { timestamps:true},
);
const BlacklistToken = mongoose.model("BlacklistToken", blacklisttSchema);
export default BlacklistToken;
