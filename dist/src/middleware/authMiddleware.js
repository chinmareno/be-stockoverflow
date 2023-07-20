import jwt from "jsonwebtoken";
export const authMiddleware = (req, res, next) => {
    try {
        const userId = req.cookies[process.env.COOKIE_NAME];
        if (!userId) {
            res.status(401).send("session expired");
        }
        const decodedToken = jwt.verify(userId, process.env.SECRET_KEY);
        req.userId = decodedToken.id;
        next();
    }
    catch (error) {
        return res.status(401).send("session expired");
    }
};
//# sourceMappingURL=authMiddleware.js.map