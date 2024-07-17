import type { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generate6digitToken } from "../utils/token";
import { transport } from "../config/nodemailer";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";
import Note, { INote } from "../models/Note";
import { Types } from "mongoose";

type NoteParams = {
  noteId: Types.ObjectId;
};

export class NoteController {
  static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
    const { content } = req.body;
    const note = new Note();

    note.content = content;
    note.createdBy = req.user.id;
    note.task = req.task.id;

    req.task.notes.push(note.id);

    try {
      await Promise.allSettled([req.task.save(), note.save()]);
      res.send(`The node was successfully added in ${req.task.taskName}`);
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  };

  static getTaskNotes = async (req: Request, res: Response) => {
    try {
      const notes = await Note.find({ task: req.task.id });

      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  };

  static deleteNote = async (req: Request<NoteParams>, res: Response) => {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
      const error = new Error("Note not found");
      return res.status(404).json({ error: error.message });
    }

    if (note.createdBy.toString() !== req.user.id.toString()) {
      const error = new Error("Invalid Action");
      return res.status(401).json({ error: error.message });
    }

    req.task.notes = req.task.notes.filter(
      (note) => note.toString() !== noteId.toString()
    );

    try {
      await Promise.allSettled([req.task.save(), note.deleteOne()]);
      res.send("The note was successfully deleted");
    } catch (error) {
      res.status(500).json({ error: "Error" });
    }
  };
}
