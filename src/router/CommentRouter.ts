import express from "express";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { CommentController } from "../controller/CommentController";
import { CommentBusiness } from "../business/CommentBusiness";
import { CommentDatabase } from "../database/CommentDatabase";
import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";

export const commentRouter = express.Router();

const commentController = new CommentController(
  new CommentBusiness(
    new CommentDatabase(),
    new UserDatabase(),
    new PostDatabase(),
    new IdGenerator(),
    new TokenManager()
  )
);

commentRouter.post("/:id", commentController.createComment);
commentRouter.get("/:id", commentController.getComments);

commentRouter.put("/:id/like", commentController.likeOrDislikeComment);
