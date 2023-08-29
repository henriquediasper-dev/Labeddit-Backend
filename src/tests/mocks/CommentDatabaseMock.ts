import {
  CommentDB,
  CommentDBWithCreatorName,
  COMMENT_LIKE,
  LikeDislikeCommentDB,
  PostCommentDB,
  PostCommentModel,
} from "../../models/Comment";
import { BaseDatabase } from "../../database/BaseDatabase";

const commentsDBMock: PostCommentModel[] = [
  {
    postId: "post-id-mock",
    creatorId: "id-mock-admin",
    name: "Admin",
    commentId: "comment-id-mock",
    commentContent: "<Hello></Hello>",
    likes: 1,
    dislikes: 0,
  },
  {
    postId: "post-id-mock",
    creatorId: "id-mock-normal",
    name: "User",
    commentId: "comment-id-mock2",
    commentContent: "Haaaaaalo!.",
    likes: 0,
    dislikes: 1,
  },
];

const commentsDBWithCreatorNameMock: CommentDBWithCreatorName[] = [
  {
    id: "comment-id-mock",
    comment_content: "<Hello></Hello>",
    likes: 1,
    dislikes: 0,
    created_at: "date-time-mock",
    creator_id: "id-mock-admin",
    creator_name: "Admin",
  },
  {
    id: "comment-id-mock2",
    comment_content: "Haaaaaalo!.",
    likes: 0,
    dislikes: 1,
    created_at: "date-time-mock",
    creator_id: "id-mock-normal",
    creator_name: "User",
  },
];

const likeDislikeCommentDBMock: LikeDislikeCommentDB[] = [
  {
    user_id: "id-mock-normal",
    comment_id: "comment-id-mock",
    like: 1,
  },
  {
    user_id: "id-mock-normal2",
    comment_id: "comment-id-mock",
    like: 0,
  },
];

export class CommentDatabaseMock extends BaseDatabase {
  public static TABLE_COMMENTS = "comments";
  public static TABLE_POST_COMMENTS = "post_comments";
  public static TABLE_LIKES_DISLIKES_COMMENTS = "likes_dislikes_comment";

  public insertComment = async (newComment: CommentDB): Promise<void> => {};

  public insertPostComment = async (
    newPostComment: PostCommentDB
  ): Promise<void> => {};

  public findCommentsByPostId = async (
    postId: string
  ): Promise<PostCommentModel[]> => {
    const result = commentsDBMock.filter(
      (commentDBMock) => commentDBMock.postId === postId
    );
    return result as PostCommentModel[];
  };

  public findCommentsWithCreatorNameById = async (
    id: string
  ): Promise<CommentDBWithCreatorName | undefined> => {
    const result = commentsDBWithCreatorNameMock.find(
      (commentDB) => commentDB.id === id
    );
    return result as CommentDBWithCreatorName | undefined;
  };

  public findLikeOrDislikeComment = async (
    likeOrDislikeComment: LikeDislikeCommentDB
  ): Promise<COMMENT_LIKE | undefined> => {
    const result = likeDislikeCommentDBMock.find(
      (likeDislikeMock) =>
        likeDislikeMock.comment_id === likeOrDislikeComment.comment_id &&
        likeDislikeMock.user_id === likeOrDislikeComment.user_id
    );

    if (result === undefined) {
      return undefined;
    } else if (result.like === 1) {
      return COMMENT_LIKE.ALREADY_LIKED;
    } else {
      return COMMENT_LIKE.ALREADY_DISLIKED;
    }
  };

  public removeLikeOrDislike = async (
    likeOrDislike: LikeDislikeCommentDB
  ): Promise<void> => {};

  public updateLikeOrDislike = async (
    likeOrDislike: LikeDislikeCommentDB
  ): Promise<void> => {};

  public insertLikeOrDislike = async (
    likeOrDislike: LikeDislikeCommentDB
  ): Promise<void> => {};

  public editComment = async (newComment: CommentDB): Promise<void> => {};
}
