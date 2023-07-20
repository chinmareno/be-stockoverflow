const errorHandler = (e, req, res, next) => {
    let error;
    let statuscode;
    switch (e.name) {
        case "Unauthorized Error":
            error = e.message;
            statuscode = e.statuscode;
            break;
        case "Unique Error":
            error = e.message;
            statuscode = e.statuscode;
            break;
        case "BadRequest Error":
            error = e.message;
            statuscode = e.statuscode;
            break;
        case "Server Error":
            error = e.message;
            statuscode = e.statuscode;
            break;
        case "NotFound Error":
            error = e.message;
            statuscode = e.statuscode;
            break;
        default:
            error = "Error occurs:" + e;
            statuscode = 500;
            break;
    }
    console.log(error, statuscode);
    res.status(statuscode).send(error);
};
export { errorHandler };
//# sourceMappingURL=errorHandler.js.map