import { transport } from "../config/nodemailer";

interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    const info = await transport.sendMail({
      from: "Home Task <admin@hometask.com>",
      to: user.email,
      subject: "Home Task - Confirm your Account",
      text: "Home Task - Confirm your Account",
      html: `
        <p>Hello: ${user.name}, your account has been created with Home Task. We are almost done, you just have to confirm your account.</p>
        
        <p>Click here:</p>
        <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirm your Account</a>
        <p>Enter the Code: <b>${user.token}</b></p>
        <p>This token expires in 10 minutes</p>

      `,
    });
  };

  static sendPasswordResetToken = async (user: IEmail) => {
    const info = await transport.sendMail({
      from: "Home Task <admin@hometask.com>",
      to: user.email,
      subject: "Home Task - Reset your Password",
      text: "Home Task - Reset your Password",
      html: `
        <p>Hello: ${user.name}, you have requested to reset your password.</p>
        
        <p>Click here:</p>
        <a href="${process.env.FRONTEND_URL}/auth/new-password">Reset Password</a>
        <p>Enter the Code: <b>${user.token}</b></p>
        <p>This token expires in 10 minutes</p>

      `,
    });
  };
}
