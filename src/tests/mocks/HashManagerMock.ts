export class HashManagerMock {
  public hash = async (plaintext: string): Promise<string> => {
    return "hash-mock";
  };

  public compare = async (
    plaintext: string,
    hash: string
  ): Promise<boolean> => {
    switch (plaintext) {
      case "user223":
        return hash === "hash-mock-user2";

      case "user123":
        return hash === "hash-mock-user";

      case "admin000":
        return hash === "hash-mock-admin";

      default:
        return false;
    }
  };
}
