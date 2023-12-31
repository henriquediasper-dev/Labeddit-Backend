import {
  COMMENT_LIKE,
  CommentDB,
  CommentDBWithCreatorName,
  LikeDislikeCommentDB,
  PostCommentDB,
  PostCommentModel,
} from "../models/Comment";
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

  public findCommentsWithCreatorNameById = async (
    id: string
  ): Promise<CommentDBWithCreatorName | undefined> => {
    const [result] = await BaseDatabase.connection(
      CommentDatabase.TABLE_COMMENTS
    )
      .select(
        `${CommentDatabase.TABLE_COMMENTS}.id`,
        `${CommentDatabase.TABLE_COMMENTS}.comment_content`,
        `${CommentDatabase.TABLE_COMMENTS}.likes`,
        `${CommentDatabase.TABLE_COMMENTS}.dislikes`,
        `${CommentDatabase.TABLE_COMMENTS}.created_at`,
        `${UserDatabase.TABLE_USERS}.id as creator_id`,
        `${UserDatabase.TABLE_USERS}.name as creator_name`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      )
      .where({ [`${CommentDatabase.TABLE_COMMENTS}.id`]: id });
    return result as CommentDBWithCreatorName | undefined;
  };

  public findLikeOrDislikeComment = async (
    likeOrDislike: LikeDislikeCommentDB
  ): Promise<COMMENT_LIKE | undefined> => {
    const [result]: LikeDislikeCommentDB[] | undefined[] =
      await BaseDatabase.connection(
        CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS
      ).where({
        user_id: likeOrDislike.user_id,
        comment_id: likeOrDislike.comment_id,
      });

    if (result === undefined) {
      return undefined;
    } else if (result.like === 1) {
      return COMMENT_LIKE.ALREADY_LIKED;
    } else {
      return COMMENT_LIKE.ALREADY_DISLIKED;
    }
  };

  public removeLikeOrDislike = async (
    likeOrdislike: LikeDislikeCommentDB
  ): Promise<void> => {
    await BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
      .del()
      .where({
        user_id: likeOrdislike.user_id,
        comment_id: likeOrdislike.comment_id,
      });
  };

  public updateLikeOrDislike = async (
    likeOrDislike: LikeDislikeCommentDB
  ): Promise<void> => {
    await BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
      .update(likeOrDislike)
      .where({
        user_id: likeOrDislike.user_id,
        comment_id: likeOrDislike.comment_id,
      });
  };

  public insertLikeOrDislike = async (
    likeOrDislike: LikeDislikeCommentDB
  ): Promise<void> => {
    await BaseDatabase.connection(
      CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS
    ).insert(likeOrDislike);
  };

  public editComment = async (newComment: CommentDB): Promise<void> => {
    await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
      .update(newComment)
      .where({ id: newComment.id });
  };
}
