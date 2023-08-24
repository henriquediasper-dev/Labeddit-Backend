import { BaseDatabase } from "./BaseDatabase";

export class CommentDatabase extends BaseDatabase {
  public static TABLE_COMMENTS = "comments";
  public static TABLE_POST_COMMENTS = "post_comments";
  public static TABLE_LIKES_DISLIKES_COMMENTS = "likes_dislikes_comment";
}
