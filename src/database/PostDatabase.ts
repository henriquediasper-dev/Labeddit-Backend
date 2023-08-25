import { PostDB } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";

export class PostDataBase extends BaseDatabase {
  public static TABLE_POSTS = "posts";
  public static TABLE_LIKES_DISLIKES_POST = "likes_dislikes_post";

  public insertPost = async (postDB: PostDB): Promise<void> => {
    await BaseDatabase.connection(PostDataBase.TABLE_POSTS).insert(postDB);
  };
}
