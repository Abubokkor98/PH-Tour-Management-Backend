import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import {
  createNewAccessTokenWithRefreshToken,
  createUserToken,
} from "../../utils/userToken";
import { JwtPayload } from "jsonwebtoken";
import { envVariables } from "../../config/env";

// const credentialsLogin = async (payload: Partial<IUser>) => {
//   const { email, password } = payload;

//   const isUserExist = await User.findOne({ email });

//   if (!isUserExist) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
//   }

//   const isPasswordMatched = await bcryptjs.compare(
//     password as string,
//     isUserExist.password as string
//   );

//   if (!isPasswordMatched) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
//   }

//   //jwt payload
//   // const jwtPayload = {
//   //   userId: isUserExist._id,
//   //   email: isUserExist.email,
//   //   role: isUserExist.role,
//   // };

//   // // const accessToken = jwt.sign(jwtPayload, "secret", {
//   // //   expiresIn: "1h",
//   // // });
//   // const accessToken = generateToken(
//   //   jwtPayload,
//   //   envVariables.JWT_ACCESS_SECRET,
//   //   envVariables.JWT_ACCESS_EXPIRES
//   // );

//   // const refreshToken = generateToken(
//   //   jwtPayload,
//   //   envVariables.JWT_REFRESH_SECRET,
//   //   envVariables.JWT_REFRESH_EXPIRES
//   // );

//   //we are using utils function insted of upper jwt payload
//   const userToken = createUserToken(isUserExist);

//   //prevent password field to show the frontend
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { password: _password, ...rest } = isUserExist.toObject();

//   return {
//     // email: isUserExist.email,
//     accessToken: userToken.accessToken,
//     refreshToken: userToken.refreshToken,
//     user: rest,
//   };
// };
const getNewAccessToken = async (refreshToken: string) => {
  const accessToken = await createNewAccessTokenWithRefreshToken(refreshToken);

  return {
    accessToken,
  };
};

const newPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isOldPasswordMatch = await bcryptjs.compare(
    oldPassword,
    user?.password as string
  );

  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old Password doesn't match");
  }

  //save new password to the user
  user.password = await bcryptjs.hash(
    newPassword,
    Number(envVariables.BCRYPT_SALT_ROUND)
  );
  //save the updated user
  await user.save();
};

//user - login - token (email, role, _id) - booking / payment / booking / payment cancel - token

export const AuthServices = {
  // credentialsLogin,
  getNewAccessToken,
  newPassword,
};
