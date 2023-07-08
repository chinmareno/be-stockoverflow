class NotFoundError extends Error {
  statuscode: number;
  constructor(message: string) {
    super(message || "Not Found");
    this.statuscode = 404;
    this.name = "NotFound Error";
  }
}

export { NotFoundError };
