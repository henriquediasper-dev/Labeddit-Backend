import { CommentDatabase } from "../database/CommentDatabase";
import { PostDataBase } from "../database/PostDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class CommentBusiness {
  constructor(
    private commentDatabase: CommentDatabase,
    private postDatabase: PostDataBase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}
}
