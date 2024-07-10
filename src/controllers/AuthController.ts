import type { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import { hasPassword } from "../utils/auth";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const user = new User(req.body);
      const { password, email } = req.body;

      // Prevent duplicates
      const userExist = await User.findOne({ email });
      if (userExist) {
        const error = new Error("The user already exist");
        return res.status(409).json({ error: error.message });
      }

      // Hash password and create an User
      user.password = await hasPassword(password);
      await user.save();

      res.send("Account created, check your email for confirmation");
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  };
}
