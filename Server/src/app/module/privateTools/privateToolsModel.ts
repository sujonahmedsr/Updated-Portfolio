import { model, Schema } from "mongoose";

const expenseSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  amount: { type: Number, required: true, min: 0.01 },
  category: { type: String, required: true, trim: true, maxlength: 60 },
  tags: { type: [String], default: [] },
  spentAt: { type: Date, required: true },
  note: { type: String, default: "", maxlength: 1000 },
  hiddenAt: { type: Date, default: null },
}, { timestamps: true, versionKey: false });
expenseSchema.index({ spentAt: -1, hiddenAt: 1 });

const dailyNoteSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  content: { type: String, required: true, maxlength: 12000 },
  noteDate: { type: Date, required: true },
  hiddenAt: { type: Date, default: null },
}, { timestamps: true, versionKey: false });
dailyNoteSchema.index({ noteDate: -1, hiddenAt: 1 });

const goalSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  description: { type: String, default: "", maxlength: 3000 },
  startsAt: { type: Date, required: true },
  dueAt: { type: Date, required: true },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  status: { type: String, enum: ["active", "completed", "paused"], default: "active" },
  milestones: [{
    title: { type: String, required: true, maxlength: 160 },
    dueAt: { type: Date, required: true },
    completedAt: { type: Date, default: null },
  }],
  hiddenAt: { type: Date, default: null },
}, { timestamps: true, versionKey: false });
goalSchema.index({ dueAt: 1, status: 1, hiddenAt: 1 });

export const ExpenseModel = model("private_expenses", expenseSchema);
export const DailyNoteModel = model("private_daily_notes", dailyNoteSchema);
export const GoalModel = model("private_goals", goalSchema);