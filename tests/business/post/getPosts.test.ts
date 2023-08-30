import { PostBusiness } from "../../../src/business/PostBusiness";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { GetPostSchema } from "../../../src/dtos/post/getPost.dto";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";

describe("Testando getPost", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );
  test("Deve retornar uma matriz de postagem", async () => {
    const input = GetPostSchema.parse({
      token: "token-mock-normal",
    });

    const output = await postBusiness.getPosts(input);

    expect(output).toEqual([
      {
        id: "post-id-mock",
        postContent: "Quero aprender mais sobre banco de dados usando SQL",
        likes: 0,
        dislikes: 1,
        comments: 0,
        createdAt: "2023-08-29T11:55:00.009Z",
        creator: {
          id: "id-mock-normal",
          name: "User",
        },
      },
      {
        id: "post-id-mock2",
        postContent: "O que você acha sobre as inteligencias artificias?",
        likes: 1,
        dislikes: 0,
        comments: 0,
        createdAt: "2023-08-29T11:59:43.401Z",
        creator: {
          id: "id-mock-admin",
          name: "Admin",
        },
      },
    ]);
  });

  test("Deve retornar erro quando o token é inválido", async () => {
    expect.assertions(2);
    try {
      const input = GetPostSchema.parse({
        token: "invalid-token",
      });

      const output = await postBusiness.getPosts(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Token inválido");
      }
    }
  });
});
