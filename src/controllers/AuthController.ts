import type { Request, Response } from "express";
import User from "../models/User";
import { hasPassword } from "../utils/auth";
import Token from "../models/Token";
import { generate6digitToken } from "../utils/token";
import { transport } from "../config/nodemailer";
import { AuthEmail } from "../emails/AuthEmail";

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

      // Generate token
      const token = new Token();
      token.token = generate6digitToken();
      token.user = user.id;

      // Send email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.email,
        token: token.token,
      });

      await Promise.allSettled([user.save(), token.save()]);

      res.send("Account created, check your email for confirmation");
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExist = await Token.findOne({ token });

      if (!tokenExist) {
        const error = new Error("Invalid Token");
        return res.status(401).json({ error: error.message });
      }

      const user = await User.findById(tokenExist.user);
      user.confirmed = true;

      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
      res.send("Account Confirmed Successfully");
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  };
}
