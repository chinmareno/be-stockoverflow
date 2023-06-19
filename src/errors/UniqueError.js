class UniqueError extends Error {
  constructor(message) {
    super(message || "Must Be Unique");
    this.statuscode = 409;
    this.name = "Unique Error";
  }
}

module.exports = UniqueError;
