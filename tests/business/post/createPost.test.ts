import { PostBusiness } from "../../../src/business/PostBusiness";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { CreatePostSchema } from "../../../src/dtos/post/createPost.dto";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";

describe("Testando createPost", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Deve enviar uma mensagem ao criar a postagem", async () => {
    const input = CreatePostSchema.parse({
      token: "token-mock-normal",
      content: "Hello World!",
    });

    const output = await postBusiness.createPost(input);

    expect(output).toEqual({
      message: "Post criado com sucesso",
    });
  });

  test("Deve retornar erro quando o token é inválido", async () => {
    expect.assertions(2);
    try {
      const input = CreatePostSchema.parse({
        token: "invalid-token",
        content: "Hello World!",
      });

      const output = await postBusiness.createPost(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Token inválido");
      }
    }
  });
});
