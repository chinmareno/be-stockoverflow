class UnauthorizedError extends Error {
    constructor(message) {
        super(message || "Incorrect password");
        this.statuscode = 401;
        this.name = "Unauthorized Error";
    }
}
export { UnauthorizedError };
//# sourceMappingURL=UnauthorizedError.js.map