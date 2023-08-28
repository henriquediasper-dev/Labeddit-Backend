import z from "zod";

export type LikeOrDislikeCommentInputDTO = {
  token: string;
  idToLikeOrDislike: string;
  like: boolean;
};

export interface LikeOrDislikeCommentOutputDTO {
  message: "Like ou Dislike";
}

export const LikeOrDislikeCommentSchema = z.object({
  token: z.string().min(1),
  idToLikeOrDislike: z.string().min(1),
  like: z.boolean(),
});
