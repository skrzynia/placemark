import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testPlacemarks, testComments, dublin12, dublin8, comment, testUsers } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Comment Model tests", () => {

  let commentslist = null;

  setup(async () => {
    db.init("mongo");
    await db.placemarkStore.deleteAllPlacemarks();
    await db.commentStore.deleteAllComments();
    commentslist = await db.placemarkStore.addPlacemark(dublin12);
    for (let i = 0; i < testComments.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testComments[i] = await db.commentStore.addComment(commentslist._id, testComments[i]);
    }
  });

  test("create single comment", async () => {
    const placemarklist = await db.placemarkStore.addPlacemark(dublin12);
    const commentObj = await db.commentStore.addComment(placemarklist._id, comment)
    assert.isNotNull(commentObj._id);
    assertSubset (comment, commentObj);
  });


  test("delete all comments", async () => {
    const comments = await db.commentStore.getAllComments();
    assert.equal(testComments.length, comments.length);
    await db.commentStore.deleteAllComments();
    const newComments = await db.commentStore.getAllComments();
    assert.equal(0, newComments.length);
  });

  test("get a comment - success", async () => {
    const placemarklist = await db.placemarkStore.addPlacemark(dublin12);
    const commentObj = await db.commentStore.addComment(placemarklist._id, comment)
    const newComment = await db.commentStore.getCommentById(commentObj._id);
    assertSubset (commentObj, newComment);
  });

  test("delete one comment - success", async () => {
    const id = testComments[0]._id;
    await db.commentStore.deleteComment(id);
    const commentsObj = await db.commentStore.getAllComments();
    assert.equal(commentsObj.length, testComments.length - 1);
    const deletedComment = await db.commentStore.getCommentById(id);
    assert.isNull(deletedComment);
  });

  test("get a comment - bad params", async () => {
    assert.isNull(await db.commentStore.getCommentById(""));
    assert.isNull(await db.commentStore.getCommentById());
  });

  test("delete one comment - fail", async () => {
    await db.commentStore.deleteComment("bad-id");
    const comments = await db.commentStore.getAllComments();
    assert.equal(comments.length, testComments.length);
  });
});
