import { PostBusiness } from "../../../src/business/PostBusiness";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { DeletePostSchema } from "../../../src/dtos/post/deletePost.dto";
import { LikeOrDislikePostSchema } from "../../../src/dtos/post/likeOrDislikePost.dto";

describe("Testando likeOrDislikePost", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Deve retornar undefined", async () => {
    const input = LikeOrDislikePostSchema.parse({
      token: "token-mock-admin",
      idToLikeOrDislike: "post-id-mock",
      like: true,
    });

    const output = await postBusiness.likeOrDislikePost(input);
  });
});
