import { BaseDatabase } from "../../src/database/BaseDatabase";
import {
  LikeDislikePostDB,
  PostDB,
  PostDBWithCreatorName,
  POST_LIKE,
} from "../../src/models/Post";

const postDBMock: PostDBWithCreatorName[] = [
  {
    id: "post-id-mock",
    creator_id: "id-mock-normal",
    post_content: "Quero aprender mais sobre banco de dados usando SQL",
    likes: 0,
    dislikes: 1,
    comments: 0,
    created_at: "2023-08-29T11:55:00.009Z",
    creator_name: "User",
  },
  {
    id: "post-id-mock2",
    creator_id: "id-mock-admin",
    post_content: "O que você acha sobre as inteligencias artificias?",
    likes: 1,
    dislikes: 0,
    comments: 0,
    created_at: "2023-08-29T11:59:43.401Z",
    creator_name: "Admin",
  },
];

const likeDislikePostDBMock: LikeDislikePostDB[] = [
  {
    user_id: "id-mock-normal",
    post_id: "post-id-mock2",
    like: 1,
  },
  {
    user_id: "id-mock-normal2",
    post_id: "post-id-mock",
    like: 0,
  },
];

export class PostDatabaseMock extends BaseDatabase {
  public static TABLE_POSTS = "posts";
  public static TABLE_LIKES_DISLIKES_POST = "likes_dislikes_post";

  public insertPost = async (newPost: PostDB): Promise<void> => {};

  public findPostsWithCreatorName = async (): Promise<
    PostDBWithCreatorName[]
  > => {
    const result = postDBMock;
    return result as PostDBWithCreatorName[];
  };

  public findPostsWithCreatorNameById = async (
    id: string
  ): Promise<PostDBWithCreatorName | undefined> => {
    const result = postDBMock.find((post) => post.id === id);
    return result as PostDBWithCreatorName | undefined;
  };

  public findPostById = async (id: string): Promise<PostDB | undefined> => {
    const result = postDBMock.find((post) => post.id === id);
    return result as PostDB | undefined;
  };

  public editPost = async (newPost: PostDB): Promise<void> => {};

  public deletePost = async (id: string): Promise<void> => {
    // Encontre o índice do post no array mock
    const index = postDBMock.findIndex((post) => post.id === id);

    // Se o post existir, remova-o do array
    if (index !== -1) {
      postDBMock.splice(index, 1);
    }
  };

  public findLikeOrDislikePost = async (
    likeDislikePost: LikeDislikePostDB
  ): Promise<POST_LIKE | undefined> => {
    const result = likeDislikePostDBMock.find(
      (likeDislikeMock) =>
        likeDislikeMock.user_id === likeDislikePost.user_id &&
        likeDislikeMock.post_id === likeDislikePost.post_id
    );

    if (result === undefined) {
      return undefined;
    } else if (result.like === 1) {
      return POST_LIKE.ALREADY_LIKED;
    } else {
      return POST_LIKE.ALREADY_DISLIKED;
    }
  };

  public removeLikeOrDislike = async (
    likeOrDislikeDB: LikeDislikePostDB
  ): Promise<void> => {};

  public updateLikeOrDislike = async (
    likeOrDislikeDB: LikeDislikePostDB
  ): Promise<void> => {};

  public insertLikeOrDislike = async (
    likeOrDislike: LikeDislikePostDB
  ): Promise<void> => {};
}
