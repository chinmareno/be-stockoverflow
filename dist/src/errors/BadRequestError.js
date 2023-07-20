class BadRequestError extends Error {
    constructor(message) {
        super(message || "Invalid request");
        this.statuscode = 400;
        this.name = "BadRequest Error";
    }
}
export { BadRequestError };
//# sourceMappingURL=BadRequestError.js.map