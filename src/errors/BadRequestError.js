class BadRequestError extends Error {
  constructor(message) {
    super(message || "Incorrect format");
    this.statuscode = 400;
    this.name = "BadRequest Error";
  }
}

module.exports = BadRequestError;
