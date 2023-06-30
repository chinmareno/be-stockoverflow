import jwt, { Secret } from "jsonwebtoken";

export const createToken = (id: string) => {
  const token = jwt.sign({ id }, process.env.SECRET_KEY as Secret);
  return token;
};
