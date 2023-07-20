class ServerError extends Error {
    constructor(message) {
        super(message || "Error occurs due to server");
        this.statuscode = 500;
        this.name = "Server Error";
    }
}
export { ServerError };
//# sourceMappingURL=ServerError.js.map