import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { TaskController } from "../controllers/TaskController";
import { handleInputErrors } from "../middleware/validation";
import { validateProjectExists } from "../middleware/project";

const router = Router();

/**
 * Projects
 */

// Create
router.post(
  "/",
  body("projectName").notEmpty().withMessage("The project name is required"),
  body("clientName").notEmpty().withMessage("The client name is required"),
  body("description").notEmpty().withMessage("The description is required"),

  handleInputErrors,
  ProjectController.createProject
);

// Get all
router.get("/", ProjectController.getAllProjects);

// Get project by id
router.get(
  "/:id",
  param("id").isMongoId().withMessage("Invalid ID"),
  handleInputErrors,
  ProjectController.getProjectById
);

// Edit
router.put(
  "/:id",
  param("id").isMongoId().withMessage("Invalid ID"),
  body("projectName").notEmpty().withMessage("The project name is required"),
  body("clientName").notEmpty().withMessage("The client name is required"),
  body("description").notEmpty().withMessage("The description is required"),
  handleInputErrors,
  ProjectController.updateProject
);

// Delete
router.delete(
  "/:id",
  param("id").isMongoId().withMessage("Invalid ID"),
  handleInputErrors,
  ProjectController.deleteProject
);

/**
 * Tasks
 */

router.post(
  "/:projectId/tasks",
  validateProjectExists,
  TaskController.createTask
);

export default router;
