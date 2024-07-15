import type { Request, Response } from "express";
import User from "../models/User";
import Project from "../models/Project";

export class TeamController {
  static findMemberByEmail = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Find user
      const user = await User.findOne({ email }).select("_id email name");

      if (!user) {
        const error = new Error("User not Found");
        return res.status(404).json({ error: error.message });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  };

  static addMemberById = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;

      // Find user
      const user = await User.findById(id).select("id");

      if (!user) {
        const error = new Error("User not Found");
        return res.status(404).json({ error: error.message });
      }

      if (
        req.project.team.some((team) => team.toString() === user.id.toString())
      ) {
        const error = new Error("The user already exist into the project");
        return res.status(404).json({ error: error.message });
      }

      req.project.team.push(user.id);
      await req.project.save();

      res.send("The user was successfully added");
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  };

  static removeMemberById = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      if (!req.project.team.some((team) => team.toString() === userId)) {
        const error = new Error("The user not exist into the project");
        return res.status(404).json({ error: error.message });
      }

      req.project.team = req.project.team.filter(
        (teamMember) => teamMember.toString() !== userId
      );

      await req.project.save();
      res.send("The user was successfully added");
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  };

  static getProjectTeam = async (req: Request, res: Response) => {
    try {
      const project = await Project.findById(req.project.id).populate({
        path: "team",
        select: "id email name",
      });

      res.json(project.team);
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  };
}
