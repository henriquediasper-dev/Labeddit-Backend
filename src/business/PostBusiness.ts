import { PostDatabase } from "../database/PostDatabase";
import {
  CreatePostInputDTO,
  CreatePostOutputDTO,
} from "../dtos/post/createPost.dto";
import { GetPostInputDTO, GetPostOutputDTO } from "../dtos/post/getPost.dto";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { Post } from "../models/Post";
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
      throw new UnauthorizedError("Invalid token");
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
}
