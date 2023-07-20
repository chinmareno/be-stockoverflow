class NotFoundError extends Error {
    constructor(message) {
        super(message || "Not Found");
        this.statuscode = 404;
        this.name = "NotFound Error";
    }
}
export { NotFoundError };
//# sourceMappingURL=NotFoundError.js.map