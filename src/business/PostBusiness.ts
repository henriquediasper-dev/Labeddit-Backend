import { PostDataBase } from "../database/PostDatabase";
import {
  CreatePostInputDTO,
  CreatePostOutputDTO,
} from "../dtos/post/createPost.dto";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { Post } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class PostBusiness {
  constructor(
    private postDatabase: PostDataBase,
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
}
