import bcrypt from "bcrypt";
import { UnauthorizedError } from "../errors";

const hashing = async (unhashed: string) => {
  const salt = await bcrypt.genSalt();
  const hashed = await bcrypt.hash(unhashed, salt);
  return hashed;
};

interface IAllError extends Error {
  statuscode: number;
}
const compareHash = (unhash: string, hashed: string, err: IAllError) => {
  const match = bcrypt.compareSync(unhash, hashed);
  if (!match) {
    err;
  }
};

const compareHashPassword = (unhash: string, hashed: string) => {
  const match = bcrypt.compareSync(unhash, hashed);
  if (!match) {
    throw new UnauthorizedError("Incorrect password");
  }
};
export { hashing, compareHash, compareHashPassword };
