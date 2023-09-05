import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { LikeOrDislikeCommentSchema } from "../../../src/dtos/comment/likeOrDislikeComment.dto";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";

describe("Testando LikeOrDislikeComment", () => {
  const commentBusiness = new CommentBusiness(
    new CommentDatabaseMock(),
    new UserDatabaseMock(),
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Deve retornar uma mensagem após o like, se nunca deu like ou dislike", async () => {
    const input = LikeOrDislikeCommentSchema.parse({
      token: "token-mock-admin",
      idToLikeOrDislike: "comment-id-mock2",
      like: true,
    });

    const output = await commentBusiness.likeOrDislikeComment(input);

    expect(output).toEqual({
      message: "Like ou Dislike",
    });
  });

  test("Deve retornar uma mensagem após o dislike, se nunca deu like ou dislike", async () => {
    const input = LikeOrDislikeCommentSchema.parse({
      token: "token-mock-admin",
      idToLikeOrDislike: "comment-id-mock2",
      like: false,
    });

    const output = await commentBusiness.likeOrDislikeComment(input);

    expect(output).toEqual({
      message: "Like ou Dislike",
    });
  });

  test("Deve retornar uma mensagem após o like se já deu like", async () => {
    const input = LikeOrDislikeCommentSchema.parse({
      token: "token-mock-normal",
      idToLikeOrDislike: "comment-id-mock",
      like: true,
    });

    const output = await commentBusiness.likeOrDislikeComment(input);
    expect(output).toEqual({
      message: "Like ou Dislike",
    });
  });

  test("Deve retornar uma mensagem após o dislike se já deu like", async () => {
    const input = LikeOrDislikeCommentSchema.parse({
      token: "token-mock-normal",
      idToLikeOrDislike: "comment-id-mock",
      like: false,
    });

    const output = await commentBusiness.likeOrDislikeComment(input);
    expect(output).toEqual({
      message: "Like ou Dislike",
    });
  });

  test("Deve retornar uma mensagem após o dislike se já deu dislike", async () => {
    const input = LikeOrDislikeCommentSchema.parse({
      token: "token-mock-normal2",
      idToLikeOrDislike: "comment-id-mock",
      like: false,
    });

    const output = await commentBusiness.likeOrDislikeComment(input);
    expect(output).toEqual({
      message: "Like ou Dislike",
    });
  });

  test("Deve retornar uma mensagem após o like se já deu dislike", async () => {
    const input = LikeOrDislikeCommentSchema.parse({
      token: "token-mock-normal2",
      idToLikeOrDislike: "comment-id-mock",
      like: true,
    });

    const output = await commentBusiness.likeOrDislikeComment(input);
    expect(output).toEqual({
      message: "Like ou Dislike",
    });
  });

  test("Deve retornar erro quando o token é inválido", async () => {
    expect.assertions(2);
    try {
      const input = LikeOrDislikeCommentSchema.parse({
        token: "invalid-token",
        idToLikeOrDislike: "comment-id-mock",
        like: true,
      });

      const output = await commentBusiness.likeOrDislikeComment(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Token inválido");
      }
    }
  });

  test("Deve retornar erro quando o ID do comentário não existir", async () => {
    expect.assertions(2);
    try {
      const input = LikeOrDislikeCommentSchema.parse({
        token: "token-mock-normal",
        idToLikeOrDislike: "invalid-post-id",
        like: true,
      });

      const output = await commentBusiness.likeOrDislikeComment(input);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("Comentário não encontrado");
      }
    }
  });

  test("Deve retornar erro quando o comentário é curtido pelo criador", async () => {
    expect.assertions(2);
    try {
      const input = LikeOrDislikeCommentSchema.parse({
        token: "token-mock-admin",
        idToLikeOrDislike: "comment-id-mock",
        like: true,
      });

      const output = await commentBusiness.likeOrDislikeComment(input);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        expect(error.statusCode).toBe(403);
        expect(error.message).toBe(
          "O criador do comentário não pode dar like ou dislike"
        );
      }
    }
  });
});
