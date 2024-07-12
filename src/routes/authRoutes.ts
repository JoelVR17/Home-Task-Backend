import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.post(
  "/create-account",
  body("name").notEmpty().withMessage("Name is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password is too short, must be at least 8 characters"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("The passwords do not match");
    }
    return true;
  }),
  body("email").isEmail().withMessage("Invalid Email"),

  handleInputErrors,

  AuthController.createAccount
);

router.post(
  "/confirm-account",
  body("token").notEmpty().withMessage("Token is required"),
  handleInputErrors,
  AuthController.confirmAccount
);

router.post(
  "/login",
  body("email").isEmail().withMessage("Invalid Email"),
  body("password").notEmpty().withMessage("Password is required"),
  handleInputErrors,
  AuthController.login
);

router.post(
  "/request-code",
  body("email").isEmail().withMessage("Invalid Email"),
  handleInputErrors,
  AuthController.requestConfirmationCode
);

router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("Invalid Email"),
  handleInputErrors,
  AuthController.forgotPassword
);

router.post(
  "/validate-token",
  body("token").notEmpty().withMessage("Token is required"),
  handleInputErrors,
  AuthController.validateToken
);

router.post(
  "/update-password/:token",
  param("token").isNumeric().withMessage("Invalid Token"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password is too short, must be at least 8 characters"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("The passwords do not match");
    }
    return true;
  }),
  handleInputErrors,
  AuthController.updatePassword
);

export default router;
