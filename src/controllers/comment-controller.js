import { CommentSpec } from "../models/joi-schemas.js";
import sanitizeHtml from "sanitize-html";
import { db } from "../models/db.js";
import { getWeather } from "../utility.js";




export const commentController = {
  index: {
    handler: async function (request, h) {
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
      const rating = await db.placemarkStore.getRating(placemark._id);
      const city = placemark.address.split(",");
      const weather = await getWeather(city);
      const viewData = {
        title: "PlaceMark",
        placemark: placemark,
        weather: weather,
        rating: rating,
        API_KEY: process.env.maps_api_key

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
        description: sanitizeHtml(request.payload.description),
        rating: request.payload.rating,
        firstName: sanitizeHtml(user.firstName),
        lastName: sanitizeHtml(user.lastName),
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
