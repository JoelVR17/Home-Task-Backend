import jwt from "jsonwebtoken";
import Types from "mongoose";

type UserPaylod = {
  id: Types.ObjectId;
};

export const generateJWT = (payload: UserPaylod) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "180d",
  });

  return token;
};
