import type { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/Task";

declare global {
  namespace Express {
    interface Request {
      task: ITask;
    }
  }
}

export const taskExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);

    if (!task) {
      const error = new Error("Task not found");
      return res.status(404).json({ error: error.message });
    }

    req.task = task;

    next();
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
};

export const taskBelongsToProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.task.project.toString() !== req.project.id.toString()) {
      const error = new Error("Invalid Action");
      return res.status(400).json({ error: error.message });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
};

export const hasAuthorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user.id.toString() !== req.project.manager.toString()) {
      const error = new Error("Invalid Action");
      return res.status(400).json({ error: error.message });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
};
