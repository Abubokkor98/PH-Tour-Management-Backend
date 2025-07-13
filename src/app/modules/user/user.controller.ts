/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";

// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     //call userService
//     const user = await userServices.createUser(req.body);

//     res.status(httpStatus.CREATED).json({
//       message: "User created successfully",
//       data: user,
//     });

//   } catch (error: any) {
//     console.error(error);
//     next(error);
//   }
// };
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //call userService
    const user = await userServices.createUser(req.body);

    res.status(httpStatus.CREATED).json({
      message: "User created successfully",
      data: user,
    });
  }
);

const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await userServices.getAllUsers();
    res.status(httpStatus.OK).json({
      success: true,
      message: "All users retrieved successfully",
      length: users.length,
      data: users,
    });
  }
);

export const UserController = {
  createUser,
  getAllUser,
};
