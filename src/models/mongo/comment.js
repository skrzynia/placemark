import Mongoose from "mongoose";

const { Schema } = Mongoose;

const commentSchema = new Schema({
  description: String,
  firstName: String,
  lastName: String,
  time: String,
  placemarkid: {
    type: Schema.Types.ObjectId,
    ref: "Placemark",
  },
});

export const Comment = Mongoose.model("Comment", commentSchema);
