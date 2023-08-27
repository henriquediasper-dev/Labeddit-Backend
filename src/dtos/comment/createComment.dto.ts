import z from "zod";

export type CreateCommentInputDTO = {
  token: string;
  postId: string;
  content: string;
};

export interface CreateCommentOutputDTO {
  message: "Comentário criado com sucesso";
}

export const CreateCommentSchema = z
  .object({
    token: z.string().min(1),
    postId: z.string().min(1),
    content: z.string().min(1),
  })
  .transform((data) => data as CreateCommentInputDTO);
