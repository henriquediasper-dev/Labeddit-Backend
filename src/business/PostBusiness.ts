import { PostDataBase } from "../database/PostDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class PostBusiness {
  constructor(
    private postDatabase: PostDataBase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}
}
