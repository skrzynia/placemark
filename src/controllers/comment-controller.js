import { CommentSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";
import { getWeather } from "../utility.js";



export const commentController = {
  index: {
    handler: async function (request, h) {
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
      const city = placemark.address.split(",");
      const weather = await getWeather(city);
      const viewData = {
        title: "PlaceMark",
        placemark: placemark,
        weather: weather

      };
      return h.view("placemark-view", viewData);
    },
  },

  addComment: {
    validate: {
      payload: CommentSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("placemark-view", { title: "Add track error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
      const user = request.auth.credentials;
      const newPlacemark = {
        description: request.payload.description,
        firstName: user.firstName,
        lastName: user.lastName,
        time: new Date().toLocaleTimeString()
      };
      await db.commentStore.addComment(placemark._id, newPlacemark);
      return h.redirect(`/placemark/${placemark._id}`);
    },
  },

  deleteComment: {
    handler: async function (request, h) {
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
      await db.commentStore.deleteComment(request.params.commentid);
      return h.redirect(`/placemark/${placemark._id}`);
    },
  },
};
