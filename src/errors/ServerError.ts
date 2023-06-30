class ServerError extends Error {
  statuscode: number;

  constructor(message: string) {
    super(message || "Error occurs due to server");
    this.statuscode = 500;
    this.name = "Server Error";
  }
}

export { ServerError };
