import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);

    try {
      await project.save();
      res.send("The project was successfully created");
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  };

  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({});
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  };

  static getProjectById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const project = await Project.findById(id).populate("tasks");

      if (!project) {
        const error = new Error("Project not found");
        return res.status(404).json({ error: error.message });
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  };

  static updateProject = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const project = await Project.findById(id);

      if (!project) {
        const error = new Error("Project not found");
        return res.status(404).json({ error: error.message });
      }

      project.clientName = req.body.clientName;
      project.projectName = req.body.projectName;
      project.description = req.body.description;

      await project.save();

      res.send("The project was successfully updated");
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  };

  static deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const project = await Project.findById(id);

      if (!project) {
        const error = new Error("Project not found");
        return res.status(404).json({ error: error.message });
      }

      await project.deleteOne();

      res.send("The project was successfully deleted");
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  };
}
