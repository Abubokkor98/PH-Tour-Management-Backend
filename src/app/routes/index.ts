import { Router } from "express";
import userRoute from "../modules/user/user.route";
import authRoute from "../modules/auth/auth.route";
import { DivisionRoutes } from "../modules/division/division.route";
import { TourRoutes } from "../modules/tour/tour.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/auth",
    route: authRoute,
  },
  {
        path: "/division",
        route: DivisionRoutes
    },
    {
        path: "/tour",
        route: TourRoutes
    }
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
