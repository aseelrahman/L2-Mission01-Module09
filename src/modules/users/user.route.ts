import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../types";

const router = Router();

// /api/v1/users/
router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.agent),
  userController.getAllUsers,
);
router.post("/", userController.createUser);
router.get(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.user),
  userController.getSingleUser,
);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export const userRoute = router;
