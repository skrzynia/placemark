import { Placemark } from "./placemark.js";
import { commentMongoStore } from "./comment-mongo-store.js";

export const placemarkMongoStore = {
  async getAllPlacemarks() {
    const placemarks = await Placemark.find().lean();
    return placemarks;
  },

  async getPlacemarkById(id) {
    if (id) {
      const placemark = await Placemark.findOne({ _id: id }).lean();
      if (placemark) {
        placemark.comments = await commentMongoStore.getCommentByPlacemarkId(placemark._id);
      }
      return placemark;
    }
    return null;
  },

  async addPlacemark(placemark) {
    const newPlacemark = new Placemark(placemark);
    const placemarkObj = await newPlacemark.save();
    return this.getPlacemarkById(placemarkObj._id);
  },


  async getRating(id){
    const comments = await commentMongoStore.getCommentByPlacemarkId(id);
    let rating = 0;
    for(let i = 0; i < comments.length; i++){
      rating += comments[i].rating / comments.length;
    }
   return rating;
  },

  async getUserPlaylists(id) {
    const playlist = await Placemark.find({ userid: id }).lean();
    return playlist;
  },

  async deletePlacemarkById(id) {
    try {
      await Placemark.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAllPlacemarks() {
    await Placemark.deleteMany({});
  }
};
