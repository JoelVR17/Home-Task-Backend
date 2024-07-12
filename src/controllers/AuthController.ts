import type { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generate6digitToken } from "../utils/token";
import { transport } from "../config/nodemailer";
import { AuthEmail } from "../emails/AuthEmail";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;

      // Prevent duplicates
      const userExist = await User.findOne({ email });
      if (userExist) {
        const error = new Error("The user already exist");
        return res.status(409).json({ error: error.message });
      }

      const user = new User(req.body);

      // Hash password and create an User
      user.password = await hashPassword(password);

      // Generate token
      const token = new Token();
      token.token = generate6digitToken();
      token.user = user.id;

      // Send email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
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
        return res.status(404).json({ error: error.message });
      }

      const user = await User.findById(tokenExist.user);
      user.confirmed = true;

      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
      res.send("Account Confirmed Successfully");
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      // User exist
      if (!user) {
        const error = new Error("User Not Found");
        return res.status(404).json({ error: error.message });
      }

      // Is confirmed user
      if (!user.confirmed) {
        const token = new Token();
        token.user = user.id;
        token.token = generate6digitToken();

        await token.save();

        // Send email
        AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token,
        });

        const error = new Error(
          "User Not Confirmed, we have sent a confirmation email"
        );
        return res.status(401).json({ error: error.message });
      }

      // Check password
      const isCorrectPassword = await checkPassword(password, user.password);

      if (!isCorrectPassword) {
        const error = new Error("Incorrect Email or Password");
        return res.status(401).json({ error: error.message });
      }

      res.send("Auth");
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  };

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Is exist user
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("The user not exist");
        return res.status(404).json({ error: error.message });
      }

      if (user.confirmed) {
        const error = new Error("The user is already confirmed");
        return res.status(403).json({ error: error.message });
      }

      // Generate token
      const token = new Token();
      token.token = generate6digitToken();
      token.user = user.id;

      // Send email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await Promise.allSettled([user.save(), token.save()]);

      res.send("The new token was sended by email");
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Is exist user
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("The user not exist");
        return res.status(404).json({ error: error.message });
      }

      // Generate token
      const token = new Token();
      token.token = generate6digitToken();
      token.user = user.id;

      // Send email
      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await token.save();

      res.send("Check your email for instructions");
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  };
}
