import express from "express";
import { PostController } from "../controller/PostController";
import { PostBusiness } from "../business/PostBusiness";
import { PostDataBase } from "../database/PostDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export const postRouter = express.Router();

const postController = new PostController(
  new PostBusiness(new PostDataBase(), new IdGenerator(), new TokenManager())
);

postRouter.post("/", postController.createPost);
// postRouter.get("/", postController.getPosts);
// postRouter.put("/:id", postController.putPost);
// postRouter.delete("/:id", postController.deletePosts);
// postRouter.put("/:id/like", postController.likeOrDislikePost)
