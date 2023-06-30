class UnauthorizedError extends Error {
  statuscode: number;
  constructor(message: string) {
    super(message || "Incorrect password");
    this.statuscode = 401;
    this.name = "Unauthorized Error";
  }
}

export { UnauthorizedError };
