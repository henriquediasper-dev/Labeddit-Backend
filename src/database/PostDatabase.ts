import { BaseDatabase } from "./BaseDatabase";

export class PostDataBase extends BaseDatabase {
  public static TABLE_POSTS = "posts";
  public static TABLE_LIKES_DISLIKES = "likes_dislikes";
}