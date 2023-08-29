import { UserBusiness } from "../../src/business/UserBusiness";
import { UserDatabaseMock } from "../mocks/UserDatabaseMock";
import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";
import { HashManagerMock } from "../mocks/HashManagerMock";
import { LoginSchema } from "../../src/dtos/user/login.dto";
import { BadRequestError } from "../../src/errors/BadRequestError";

describe("Testando login", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("Deve gerar token no login", async () => {
    const input = LoginSchema.parse({
      email: "user@email.com",
      password: "user123",
    });

    const output = await userBusiness.login(input);

    expect(output).toEqual({
      token: "token-mock-normal",
    });
  });

  test("Deve retornar erro quando o e-mail não for encontrado", async () => {
    expect.assertions(2);

    try {
      const input = LoginSchema.parse({
        email: "user99@email.com",
        password: "user123",
      });

      const output = await userBusiness.login(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe("E-mail e/ou senha inválido(s)");
      }
    }
  });

  test("Deve retornar erro se a senha estiver incorreta", async () => {
    expect.assertions(2);

    try {
      const input = LoginSchema.parse({
        email: "user@email.com",
        password: "incorrect-password",
      });

      const output = await userBusiness.login(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe("E-mail e/ou senha inválido(s)");
      }
    }
  });
});
