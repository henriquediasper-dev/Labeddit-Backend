import { USER_ROLES, UserDB } from "../../models/User";
import { BaseDatabase } from "../../database/BaseDatabase";

const usersMock: UserDB[] = [
  {
    id: "id-mock-normal",
    name: "User",
    email: "user@email.com",
    password: "hash-mock-user", // password = "user123"
    created_at: new Date().toISOString(),
    role: USER_ROLES.NORMAL,
  },
  {
    id: "id-mock-normal2",
    name: "User2",
    email: "user2@email.com",
    password: "hash-mock-user2", // password = "user223"
    created_at: new Date().toISOString(),
    role: USER_ROLES.NORMAL,
  },
  {
    id: "id-mock-admin",
    name: "Admin",
    email: "admin@email.com",
    password: "hash-mock-admin", // password = "admin000"
    created_at: new Date().toISOString(),
    role: USER_ROLES.ADMIN,
  },
];

export class UserDatabaseMock extends BaseDatabase {
  public static TABLE_USERS = "users";

  public insertUser = async (newUser: UserDB): Promise<void> => {};

  public findUserByEmail = async (
    email: string
  ): Promise<UserDB | undefined> => {
    return usersMock.filter((user) => user.email === email)[0];
  };
}
