import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    //call userService
    const user = await userServices.createUser(req.body);

    res.status(httpStatus.CREATED).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    console.error(error);
    res.status(httpStatus.BAD_REQUEST).json({
      message: `Something went wrong! ${error.message}`,
    });
  }
};

export const UserController = {
  createUser,
};
