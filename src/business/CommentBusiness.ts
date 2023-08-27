import { CommentDatabase } from "../database/CommentDatabase";
import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import {
  CreateCommentInputDTO,
  CreateCommentOutputDTO,
} from "../dtos/comment/createComment.dto";
import {
  GetCommentsInputDTO,
  GetCommentsOutputDTO,
} from "../dtos/comment/getCommentsByPostId.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { Comment, PostCommentDB } from "../models/Comment";
import { Post } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class CommentBusiness {
  constructor(
    private commentDatabase: CommentDatabase,
    private userDatabase: UserDatabase,
    private postDatabase: PostDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}

  public createComment = async (
    input: CreateCommentInputDTO
  ): Promise<CreateCommentOutputDTO> => {
    const { token, postId, content } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("Token inválido");
    }

    const postIdExists = await this.postDatabase.findPostsWithCreatorNameById(
      postId
    );

    if (!postIdExists) {
      throw new NotFoundError("Id da postagem é inválido");
    }

    const postCreatorExists = await this.userDatabase.findUserById(
      postIdExists.creator_id
    );

    if (!postCreatorExists) {
      throw new BadRequestError("Criador do post não existe");
    }

    const id = this.idGenerator.generate();

    const newComment = new Comment(
      id,
      content,
      0,
      0,
      new Date().toISOString(),
      payload.id,
      payload.name
    );

    const newCommentDB = newComment.toDBModel();

    await this.commentDatabase.insertComment(newCommentDB);

    const newPostCommentDB: PostCommentDB = {
      post_id: postId,
      comment_id: id,
    };

    await this.commentDatabase.insertCommentIntoPostComment(newPostCommentDB);

    const updatePostIdExists = new Post(
      postIdExists.id,
      postIdExists.post_content,
      postIdExists.likes,
      postIdExists.dislikes,
      postIdExists.comments,
      postIdExists.created_at,
      postIdExists.creator_id,
      postIdExists.creator_name
    );

    updatePostIdExists.addComment();

    const updatePostIdExistsDB = updatePostIdExists.toDBModel();
    await this.postDatabase.editPost(updatePostIdExistsDB);

    const output: CreateCommentOutputDTO = {
      message: "Comentário criado com sucesso",
    };

    return output;
  };

  public getComments = async (
    input: GetCommentsInputDTO
  ): Promise<GetCommentsOutputDTO> => {
    const { token, postId } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("Você precisa estar autenticado");
    }

    const post = await this.postDatabase.findPostById(postId);

    if (!post) {
      throw new BadRequestError("Post não existe");
    }

    const commentsDB = await this.commentDatabase.findCommentsPostById(postId);

    const output: GetCommentsOutputDTO = {
      comments: commentsDB,
    };

    return output;
  };
}
