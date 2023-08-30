import { UserBusiness } from "../../../src/business/UserBusiness";
import { SignupSchema } from "../../../src/dtos/user/signup.dto";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { ConflictError } from "../../../src/errors/ConflictError";

describe("Testando signup", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("Deve gerar token ao se registrar", async () => {
    const input = SignupSchema.parse({
      name: "User3",
      email: "user3@email.com",
      password: "user321",
    });

    const output = await userBusiness.signup(input);

    expect(output).toEqual({
      token: "token-mock",
    });
  });

  test("Deve gerar um erro se o e-mail já existir", async () => {
    // expect.assertions(2);

    try {
      const input = SignupSchema.parse({
        name: "User3",
        email: "user2@email.com",
        password: "user321",
      });

      const output = await userBusiness.signup(input);
    } catch (error) {
      if (error instanceof ConflictError) {
        expect(error.statusCode).toBe(409);
        expect(error.message).toBe("E-mail já existe");
      }
    }
  });
});
