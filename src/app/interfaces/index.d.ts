import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

//NOTE: This is a custom type for ExpressJS (build by ourself) and the type is "user"
