import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { CreateCommentSchema } from "../../../src/dtos/comment/createComment.dto";
import { GetCommentsSchema } from "../../../src/dtos/comment/getCommentsByPostId.dto";

describe("Testando getComment", () => {
  const commentBusiness = new CommentBusiness(
    new CommentDatabaseMock(),
    new UserDatabaseMock(),
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Deve retornar os comentários do post", async () => {
    const input = GetCommentsSchema.parse({
      token: "token-mock-normal",
      postId: "post-id-mock",
    });

    const output = await commentBusiness.getComments(input);

    expect(output).toEqual({
      comments: [
        {
          postId: "post-id-mock",
          creatorId: "id-mock-admin",
          name: "Admin",
          commentId: "comment-id-mock",
          commentContent: "<Hello></Hello>",
          likes: 1,
          dislikes: 0,
        },
        {
          postId: "post-id-mock",
          creatorId: "id-mock-normal",
          name: "User",
          commentId: "comment-id-mock2",
          commentContent: "Haaaaaalo!.",
          likes: 0,
          dislikes: 1,
        },
      ],
    });
  });
});
