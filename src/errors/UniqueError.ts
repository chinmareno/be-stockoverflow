class UniqueError extends Error {
  statuscode: number;

  constructor(message: string) {
    super(message || "Must Be Unique");
    this.statuscode = 409;
    this.name = "Unique Error";
  }
}

export { UniqueError };
