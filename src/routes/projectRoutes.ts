import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { TaskController } from "../controllers/TaskController";
import { handleInputErrors } from "../middleware/validation";
import { projectExists } from "../middleware/project";
import {
  hasAuthorization,
  taskBelongsToProject,
  taskExists,
} from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router();

/**
 * Projects
 */

// Set Restricted Mode in Projects
router.use(authenticate);

// Create
router.post(
  "/",
  body("projectName").notEmpty().withMessage("Project name is required"),
  body("clientName").notEmpty().withMessage("Client name is required"),
  body("description").notEmpty().withMessage("Project description is required"),

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

router.param("projectId", projectExists);

// Edit
router.put(
  "/:projectId",
  param("projectId").isMongoId().withMessage("Invalid ID"),
  body("projectName").notEmpty().withMessage("Project name is required"),
  body("clientName").notEmpty().withMessage("Client name is required"),
  body("description").notEmpty().withMessage("Project description is required"),
  handleInputErrors,
  hasAuthorization,
  ProjectController.updateProject
);

// Delete
router.delete(
  "/:projectId",
  param("projectId").isMongoId().withMessage("Invalid ID"),
  handleInputErrors,
  hasAuthorization,
  ProjectController.deleteProject
);

/**
 * Tasks
 */

router.param("taskId", taskExists);
router.param("taskId", taskBelongsToProject);

// Create
router.post(
  "/:projectId/tasks",
  body("taskName").notEmpty().withMessage("Task name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  handleInputErrors,
  TaskController.createTask
);

// Get tasks by project
router.get("/:projectId/tasks", TaskController.getProjectTasks);

// Get tasks by id
router.get(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("Invalid ID"),
  handleInputErrors,
  TaskController.getTaskById
);

// Edit
router.put(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("Invalid ID"),
  body("taskName").notEmpty().withMessage("Task name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  handleInputErrors,
  TaskController.updateTask
);

// Delete
router.delete(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("Invalid ID"),
  handleInputErrors,
  TaskController.deleteTask
);

// Change Status
router.post(
  "/:projectId/tasks/:taskId/status",
  param("taskId").isMongoId().withMessage("Invalid ID"),
  body("status").notEmpty().withMessage("Status is required"),
  handleInputErrors,
  TaskController.updateStatus
);

/**
 * Team
 */
router.post(
  "/:projectId/team/find",
  body("email").isEmail().toLowerCase().withMessage("Invalid Email"),
  handleInputErrors,
  TeamController.findMemberByEmail
);

router.post(
  "/:projectId/team",
  body("id").isMongoId().withMessage("Invalid ID"),
  handleInputErrors,
  TeamController.addMemberById
);

router.delete(
  "/:projectId/team/:userId",
  param("userId").isMongoId().withMessage("Invalid ID"),
  handleInputErrors,
  TeamController.removeMemberById
);

router.get(
  "/:projectId/team",
  handleInputErrors,
  TeamController.getProjectTeam
);

/**
 * Notes
 */
router.post(
  "/:projectId/tasks/:taskId/notes",
  body("content").notEmpty().withMessage("Content is required"),
  handleInputErrors,
  NoteController.createNote
);

router.get("/:projectId/tasks/:taskId/notes", NoteController.getTaskNotes);

router.delete(
  "/:projectId/tasks/:taskId/notes/:noteId",
  param("noteId").isMongoId().withMessage("Invalid ID"),
  handleInputErrors,
  NoteController.deleteNote
);

export default router;
