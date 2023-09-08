import z from "zod";
import { PostCommentModel } from "../../models/Comment";

export type GetCommentsInputDTO = {
  token: string;
  postId: string;
};

export interface GetCommentsOutputDTO {
  comments: PostCommentModel[];
}

export const GetCommentsSchema = z.object({
  token: z.string().min(1),
  postId: z.string().min(1),
});
