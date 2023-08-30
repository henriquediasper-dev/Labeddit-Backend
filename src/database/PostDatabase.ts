import {
  LikeDislikePostDB,
  POST_LIKE,
  PostDB,
  PostDBWithCreatorName,
} from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDatabase {
  public static TABLE_POSTS = "posts";
  public static TABLE_LIKES_DISLIKES_POST = "likes_dislikes_post";

  public insertPost = async (postDB: PostDB): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS).insert(postDB);
  };

  public findPostsWithCreatorName = async (): Promise<
    PostDBWithCreatorName[]
  > => {
    const result: PostDB[] = await BaseDatabase.connection(
      PostDatabase.TABLE_POSTS
    )
      .select(
        `${PostDatabase.TABLE_POSTS}.id`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        `${PostDatabase.TABLE_POSTS}.post_content`,
        `${PostDatabase.TABLE_POSTS}.likes`,
        `${PostDatabase.TABLE_POSTS}.dislikes`,
        `${PostDatabase.TABLE_POSTS}.comments`,
        `${PostDatabase.TABLE_POSTS}.created_at`,
        `${UserDatabase.TABLE_USERS}.name as creator_name`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      );
    return result as PostDBWithCreatorName[];
  };

  public findPostsWithCreatorNameById = async (
    id: string
  ): Promise<PostDBWithCreatorName | undefined> => {
    const [result] = await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .select(
        `${PostDatabase.TABLE_POSTS}.id`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        `${PostDatabase.TABLE_POSTS}.post_content`,
        `${PostDatabase.TABLE_POSTS}.likes`,
        `${PostDatabase.TABLE_POSTS}.dislikes`,
        `${PostDatabase.TABLE_POSTS}.comments`,
        `${PostDatabase.TABLE_POSTS}.created_at`,
        `${UserDatabase.TABLE_USERS}.name as creator_name`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      )
      .where({ [`${PostDatabase.TABLE_POSTS}.id`]: id });
    return result as PostDBWithCreatorName | undefined;
  };

  public findPostById = async (id: string): Promise<PostDB | undefined> => {
    const [postDB]: PostDB[] | undefined[] = await BaseDatabase.connection(
      PostDatabase.TABLE_POSTS
    ).where({ id });

    return postDB;
  };

  public editPost = async (postDB: PostDB): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .update(postDB)
      .where({ id: postDB.id });
  };

  public deletePost = async (id: string): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS).del().where({ id });
  };

  public findLikeOrDislikePost = async (
    likeOrDislike: LikeDislikePostDB
  ): Promise<POST_LIKE | undefined> => {
    const [result] = await BaseDatabase.connection(
      PostDatabase.TABLE_LIKES_DISLIKES_POST
    )
      .select()
      .where({
        user_id: likeOrDislike.user_id,
        post_id: likeOrDislike.post_id,
      });

    return result as POST_LIKE | undefined;
  };

  public removeLikeOrDislike = async (
    likeOrDislike: LikeDislikePostDB
  ): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES_POST)
      .delete()
      .where({
        user_id: likeOrDislike.user_id,
        post_id: likeOrDislike.post_id,
      });
  };

  public updateLikeOrDislike = async (
    likeOrDislike: LikeDislikePostDB
  ): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES_POST)
      .update(likeOrDislike)
      .where({
        user_id: likeOrDislike.user_id,
        post_id: likeOrDislike.post_id,
      });
  };

  public insertLikeOrDislike = async (
    likeOrDislike: LikeDislikePostDB
  ): Promise<void> => {
    await BaseDatabase.connection(
      PostDatabase.TABLE_LIKES_DISLIKES_POST
    ).insert(likeOrDislike);
  };
}
