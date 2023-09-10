import { PostBusiness } from "../../../src/business/PostBusiness";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { EditPostSchema } from "../../../src/dtos/post/editPost.dto";

describe("Testando editPost", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Deve retornar undefined", async () => {
    const input = EditPostSchema.parse({
      token: "token-mock-normal",
      idToEdit: "post-id-mock",
      content: "new-content",
    });

    const output = await postBusiness.editPost(input);

    expect(output).toBeUndefined();
  });
});
