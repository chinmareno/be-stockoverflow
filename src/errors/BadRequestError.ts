class BadRequestError extends Error {
  statuscode: number;
  constructor(message: string) {
    super(message || "Invalid request");
    this.statuscode = 400;
    this.name = "BadRequest Error";
  }
}

export { BadRequestError };
