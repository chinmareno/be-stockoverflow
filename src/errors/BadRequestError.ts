class BadRequestError extends Error {
  statuscode: number;
  constructor(message: string) {
    super(message || "Incorrect format");
    this.statuscode = 400;
    this.name = "BadRequest Error";
  }
}

export { BadRequestError };
