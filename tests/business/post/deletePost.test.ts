import { PostBusiness } from "../../../src/business/PostBusiness";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { DeletePostSchema } from "../../../src/dtos/post/deletePost.dto";

describe("Testando deletePost", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Deve retornar undefined", async () => {
    const input = DeletePostSchema.parse({
      token: "token-mock-normal",
      idToDelete: "post-id-mock",
      content: "new-content",
    });

    const output = await postBusiness.deletePost(input);

    expect(output).toBeUndefined();
  });
});
