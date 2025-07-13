import { IUser } from "./user.interface";
import { User } from "./user.model";

//IUser er sob data amra pathabona, tai Partial use kora
const createUser = async (payload: Partial<IUser>) => {
  const { name, email } = payload;

  const user = await User.create({
    name,
    email,
  });

  return user;
};

export const userServices = {
  createUser,
};
