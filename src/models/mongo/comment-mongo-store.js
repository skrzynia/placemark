import { Comment } from "./comment.js";


export const commentMongoStore = {
  async getAllComments() {
    const comments = await Comment.find().lean();
    return comments;
  },

  async addComment(placemarkId, comment) {
    comment.placemarkid = placemarkId;
    const newComment = new Comment(comment);
    const commentObj = await newComment.save();
    return this.getCommentById(commentObj._id);
  },

  async getCommentByPlacemarkId(id) {
    const tracks = await Comment.find({ placemarkid: id }).lean();
    return tracks;
  },

  async getCommentById(id) {
    if (id) {
      const comment = await Comment.findOne({ _id: id }).lean();
      return comment;
    }
    return null;
  },

  async deleteComment(id) {
    try {
      await Comment.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAllComments() {
    await Comment.deleteMany({});
  },
};
