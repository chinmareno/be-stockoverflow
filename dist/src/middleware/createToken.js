import jwt from "jsonwebtoken";
export const createToken = (id) => {
    const token = jwt.sign({ id }, process.env.SECRET_KEY);
    return token;
};
//# sourceMappingURL=createToken.js.map