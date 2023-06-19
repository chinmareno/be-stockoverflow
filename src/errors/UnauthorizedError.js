class UnauthorizedError extends Error {
  constructor(message) {
    super(message || "Incorrect password");
    this.statuscode = 401;
    this.name = "Unauthorized Error";
  }
}

module.exports = UnauthorizedError;
