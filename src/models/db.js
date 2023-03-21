import { userMongoStore } from "./mongo/user-mongo-store.js";
import { placemarkMongoStore } from "./mongo/placemark-mongo-store.js";
import { commentMongoStore } from "./mongo/comment-mongo-store.js";
import { connectMongo } from "./mongo/connect.js";

export const db = {
  userStore: null,
  placemarkStore: null,
  commentStore: null,

  init() {
    this.userStore = userMongoStore;
    this.placemarkStore = placemarkMongoStore;
    this.commentStore = commentMongoStore;
    connectMongo();
  }
};
