import Mongoose from "mongoose";

const { Schema } = Mongoose;

const placemarkSchema = new Schema({
  title: String,
  description: String,
  address: String,
  date: String,
  time: String,
  rate: Number,
  userid: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  firstName: String,
  lastName: String
});

export const Placemark = Mongoose.model("Placemark", placemarkSchema);
