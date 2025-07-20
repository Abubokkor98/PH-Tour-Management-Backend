/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setCookie";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    //set refreshToken to the cookies
    // res.cookie("refreshToken", loginInfo.refreshToken, {
    //   httpOnly: true,
    //   secure: false,
    // });
    //set accessToken to the cookies
    // res.cookie("accessToken", loginInfo.accessToken, {
    //   httpOnly: true,
    //   secure: false,
    // });
    setAuthCookie(res, loginInfo);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged In Successfully",
      data: loginInfo,
    });
  }
);
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No referesh token received from cookies"
      );
    }
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

    //set latest accessToken to the cookies
    // res.cookie("accessToken", tokenInfo.accessToken, {
    //   httpOnly: true,
    //   secure: false,
    // });
    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged In Successfully",
      data: tokenInfo,
    });
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
};
