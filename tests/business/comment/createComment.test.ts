import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { CreateCommentSchema } from "../../../src/dtos/comment/createComment.dto";

describe("Testando createComment", () => {
  const commentBusiness = new CommentBusiness(
    new CommentDatabaseMock(),
    new UserDatabaseMock(),
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Deve retornar uma mensagem de sucesso", async () => {
    const input = CreateCommentSchema.parse({
      token: "token-mock-normal",
      postId: "post-id-mock",
      content: "new-comment",
    });

    const output = await commentBusiness.createComment(input);

    expect(output).toEqual({ message: "Comentário criado com sucesso" });
  });
});
