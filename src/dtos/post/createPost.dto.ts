import z from "zod";

export interface createPostInputDTO {
  name: string;
  token: string;
}

export type createPostOutputDTO = undefined;

export const creatPostSchema = z.object({
  name: z.string().min(1),
  token: z.string().min(1),
});
