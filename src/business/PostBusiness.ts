import { PostDatabase } from "../database/PostDatabase";
import {
  CreatePostInputDTO,
  CreatePostOutputDTO,
} from "../dtos/post/createPost.dto";
import {
  DeletePostInputDTO,
  DeletePostOutputDTO,
} from "../dtos/post/deletePost.dto";
import { EditPostInputDTO, EditPostOutputDTO } from "../dtos/post/editPost.dto";
import { GetPostInputDTO, GetPostOutputDTO } from "../dtos/post/getPost.dto";
import {
  LikeOrDislikePostInputDTO,
  LikeOrDislikePostOutputDTO,
} from "../dtos/post/likeOrDislikePost.dto";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { LikeDislikePostDB, POST_LIKE, Post } from "../models/Post";
import { USER_ROLES } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class PostBusiness {
  constructor(
    private postDatabase: PostDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}

  public createPost = async (
    input: CreatePostInputDTO
  ): Promise<CreatePostOutputDTO> => {
    const { token, content } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("Token inválido");
    }

    const id = this.idGenerator.generate();

    const post = new Post(
      id,
      content,
      0,
      0,
      0,
      new Date().toISOString(),
      payload.id,
      payload.name
    );

    const postDB = post.toDBModel();

    await this.postDatabase.insertPost(postDB);

    const output: CreatePostOutputDTO = {
      message: "Post criado com sucesso",
    };

    return output;
  };

  public getPosts = async (
    input: GetPostInputDTO
  ): Promise<GetPostOutputDTO> => {
    const { token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("Token inválido");
    }

    const postsWithCreatorName =
      await this.postDatabase.findPostsWithCreatorName();

    const posts = postsWithCreatorName.map((postsWithCreatorName) => {
      const post = new Post(
        postsWithCreatorName.id,
        postsWithCreatorName.post_content,
        postsWithCreatorName.likes,
        postsWithCreatorName.dislikes,
        postsWithCreatorName.comments,
        postsWithCreatorName.created_at,
        postsWithCreatorName.creator_id,
        postsWithCreatorName.creator_name
      );
      return post.toBusinessModel();
    });

    const output: GetPostOutputDTO = posts;

    return output;
  };

  public editPost = async (
    input: EditPostInputDTO
  ): Promise<EditPostOutputDTO> => {
    const { token, idToEdit, content } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("Token inválido");
    }

    const postDBExists = await this.postDatabase.findPostById(idToEdit);

    if (!postDBExists) {
      throw new NotFoundError("Post não encontrado");
    }

    if (postDBExists.creator_id !== payload.id) {
      throw new UnauthorizedError(
        "Somente o criador da postagem pode editá-la"
      );
    }

    const post = new Post(
      postDBExists.id,
      postDBExists.post_content,
      postDBExists.likes,
      postDBExists.dislikes,
      postDBExists.comments,
      postDBExists.created_at,
      postDBExists.creator_id,
      payload.name
    );

    post.setContent(content);

    const updatedPostDB = post.toDBModel();
    await this.postDatabase.editPost(updatedPostDB);

    const output: EditPostOutputDTO = undefined;

    return output;
  };

  public deletePost = async (
    input: DeletePostInputDTO
  ): Promise<DeletePostOutputDTO> => {
    const { token, idToDelete } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("Token inválido");
    }

    const postDBExists = await this.postDatabase.findPostById(idToDelete);

    if (!postDBExists) {
      throw new NotFoundError("Post não encontrado");
    }

    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== postDBExists.creator_id) {
        throw new ForbiddenError("Only the creator of the post can delete it");
      }
    }

    await this.postDatabase.deletePost(idToDelete);

    const output: DeletePostOutputDTO = undefined;

    return output;
  };

  public likeOrDislikePost = async (
    input: LikeOrDislikePostInputDTO
  ): Promise<LikeOrDislikePostOutputDTO> => {
    const { idToLikeOrDislike, token, like } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("Token inválido");
    }

    const postDBWithCreatorName =
      await this.postDatabase.findPostsWithCreatorNameById(idToLikeOrDislike);

    if (!postDBWithCreatorName) {
      throw new NotFoundError("Post com essa id não existe");
    }

    const post = new Post(
      postDBWithCreatorName.id,
      postDBWithCreatorName.post_content,
      postDBWithCreatorName.likes,
      postDBWithCreatorName.dislikes,
      postDBWithCreatorName.comments,
      postDBWithCreatorName.created_at,
      postDBWithCreatorName.creator_id,
      postDBWithCreatorName.creator_name
    );

    const likeSQLite = like ? 1 : 0;

    const likeOrDislikeDB: LikeDislikePostDB = {
      user_id: payload.id,
      post_id: idToLikeOrDislike,
      like: likeSQLite,
    };

    const likeDislikeExist = await this.postDatabase.findLikeDislike(
      likeOrDislikeDB
    );

    if (likeDislikeExist === POST_LIKE.ALREADY_LIKED) {
      if (like) {
        await this.postDatabase.removeLikeOrDislike(likeOrDislikeDB);
        post.removeLike();
      } else {
        await this.postDatabase.updateLikeDislike(likeOrDislikeDB);
        post.removeLike();
        post.addDislike();
      }
    } else if (likeDislikeExist === POST_LIKE.ALREADY_DISLIKED) {
      if (like === false) {
        await this.postDatabase.updateLikeDislike(likeOrDislikeDB);
        post.removeDislike();
      } else {
        await this.postDatabase.updateLikeDislike(likeOrDislikeDB);
        post.removeDislike();
        post.addLike();
      }
    } else {
      await this.postDatabase.insertLikeDislike(likeOrDislikeDB);
      like ? post.addLike() : post.addDislike();
    }

    const updatePostDB = post.toDBModel();
    await this.postDatabase.editPost(updatePostDB);

    const output: LikeOrDislikePostOutputDTO = undefined;

    return output;
  };
}
