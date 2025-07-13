import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //call userService
    const user = await userServices.createUser(req.body);

    res.status(httpStatus.CREATED).json({
      message: "User created successfully",
      data: user,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};

export const UserController = {
  createUser,
};
