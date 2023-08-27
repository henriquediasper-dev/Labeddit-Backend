import { CommentDB, PostCommentDB, PostCommentModel } from "../models/Comment";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class CommentDatabase extends BaseDatabase {
  public static TABLE_COMMENTS = "comments";
  public static TABLE_POST_COMMENTS = "post_comments";
  public static TABLE_LIKES_DISLIKES_COMMENTS = "likes_dislikes_comment";

  public insertComment = async (newComment: CommentDB): Promise<void> => {
    await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS).insert(
      newComment
    );
  };

  public insertCommentIntoPostComment = async (
    newComment: PostCommentDB
  ): Promise<void> => {
    await BaseDatabase.connection(CommentDatabase.TABLE_POST_COMMENTS).insert(
      newComment
    );
  };

  public findCommentsPostById = async (
    postId: string
  ): Promise<Array<PostCommentModel>> => {
    const result = await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
      .select(
        `${UserDatabase.TABLE_USERS}.id as creatorId`,
        `${UserDatabase.TABLE_USERS}.name as creatorName`,
        `${CommentDatabase.TABLE_POST_COMMENTS}.post_id as postId`,
        `${CommentDatabase.TABLE_COMMENTS}.id as commentId`,
        `${CommentDatabase.TABLE_COMMENTS}.comment_content as commentContent`,
        `${CommentDatabase.TABLE_COMMENTS}.likes`,
        `${CommentDatabase.TABLE_COMMENTS}.dislikes`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${UserDatabase.TABLE_USERS}.id`,
        "=",
        `${CommentDatabase.TABLE_COMMENTS}.creator_id`
      )
      .join(
        `${CommentDatabase.TABLE_POST_COMMENTS}`,
        `${CommentDatabase.TABLE_POST_COMMENTS}.comment_id`,
        "=",
        `${CommentDatabase.TABLE_COMMENTS}.id`
      )
      .where({ post_id: postId });

    return result;
  };
}
