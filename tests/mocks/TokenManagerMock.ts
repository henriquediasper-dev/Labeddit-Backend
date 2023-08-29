import { TokenPayload, USER_ROLES } from "../../src/models/User";

export class TokenManagerMock {
  public createToken = (payload: TokenPayload): string => {
    if (payload.id === "id-mock") {
      return "token-mock";
    } else if (payload.id === "id-mock-normal") {
      return "token-mock-normal";
    } else if (payload.id === "id-mock-normal2") {
      return "token-mock-normal2";
    } else {
      return "token-mock-admin";
    }
  };

  public getPayload = (token: string): TokenPayload | null => {
    if (token === "token-mock-normal") {
      return {
        id: "id-mock-normal",
        name: "User",
        role: USER_ROLES.NORMAL,
      };
    } else if (token === "token-mock-normal2") {
      return {
        id: "id-mock-normal2",
        name: "User2",
        role: USER_ROLES.NORMAL,
      };
    } else if (token === "token-mock-admin") {
      return {
        id: "id-mock-admin",
        name: "Admin",
        role: USER_ROLES.ADMIN,
      };
    } else {
      return null;
    }
  };
}
