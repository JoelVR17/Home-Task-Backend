import type { Request, Response } from "express";
import Project from "../models/Project";
import Task from "../models/Task";

export class TaskController {
  static createTask = async (req: Request, res: Response) => {
    try {
      const task = new Task(req.body);

      task.project = req.project.id;
      req.project.tasks.push(task.id);

      await Promise.allSettled([task.save(), req.project.save()]);

      res.send("The task was successfully created");
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  };

  static getProjectTasks = async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({ project: req.project.id }).populate(
        "project"
      );

      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  };

  static getTaskById = async (req: Request, res: Response) => {
    try {
      res.json(req.task);
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  };

  static updateTask = async (req: Request, res: Response) => {
    try {
      req.task.taskName = req.body.taskName;
      req.task.description = req.body.description;

      await req.task.save();

      res.send("The task was successfully updated");
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  };

  static deleteTask = async (req: Request, res: Response) => {
    try {
      req.project.tasks = req.project.tasks.filter(
        (task: any) => task._id.toString() !== req.task.id.toString()
      );

      await Promise.allSettled([req.task.deleteOne(), req.project.save()]);

      res.send("The task was successfully deleted");
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  };

  static updateStatus = async (req: Request, res: Response) => {
    try {
      const { status } = req.body;

      req.task.status = status;
      await req.task.save();

      res.send("The task was successfully update");
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  };
}
