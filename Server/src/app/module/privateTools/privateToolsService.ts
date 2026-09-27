import { isValidObjectId, Model } from "mongoose";
import { ExpenseModel, DailyNoteModel, GoalModel } from "./privateToolsModel";

type Kind = "expense" | "note" | "goal";
const models: Record<Kind, Model<any>> = { expense: ExpenseModel, note: DailyNoteModel, goal: GoalModel };
const validMonth = (month: string) => /^\d{4}-(0[1-9]|1[0-2])$/.test(month);
const monthBounds = (month: string) => {
  if (!validMonth(month)) throw Object.assign(new Error("month must use YYYY-MM format"), { statusCode: 400 });
  const [year, numericMonth] = month.split("-").map(Number);
  return { $gte: new Date(Date.UTC(year, numericMonth - 1, 1)), $lt: new Date(Date.UTC(year, numericMonth, 1)) };
};
const validatePayload = (payload: Record<string, unknown>, fields: string[]) => {
  for (const field of fields) {
    if (payload[field] === undefined || payload[field] === null || payload[field] === "") {
      throw Object.assign(new Error(`${field} is required`), { statusCode: 400 });
    }
  }
};
const assertId = (id: string) => {
  if (!isValidObjectId(id)) throw Object.assign(new Error("Invalid record id"), { statusCode: 400 });
};
const update = async (model: Model<any>, id: string, payload: Record<string, unknown>) => {
  assertId(id);
  const result = await model.findOneAndUpdate({ _id: id, hiddenAt: null }, payload, { new: true, runValidators: true });
  if (!result) throw Object.assign(new Error("Record not found"), { statusCode: 404 });
  return result;
};

const getExpenses = async (month: string, hidden: boolean) => {
  const dateBounds = monthBounds(month);
  const filter = { spentAt: dateBounds, hiddenAt: hidden ? { $ne: null } : null };
  const [result, aggregate] = await Promise.all([
    ExpenseModel.find(filter).sort({ spentAt: -1, _id: -1 }).lean(),
    ExpenseModel.aggregate([
      { $match: { spentAt: dateBounds, hiddenAt: null } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]),
  ]);
  return { result, summary: { total: aggregate[0]?.total || 0, count: aggregate[0]?.count || 0 } };
};
const createExpense = async (payload: Record<string, unknown>) => {
  validatePayload(payload, ["title", "amount", "category", "spentAt"]);
  return ExpenseModel.create(payload);
};
const updateExpense = (id: string, payload: Record<string, unknown>) => update(ExpenseModel, id, payload);

const getNotes = async (month: string, hidden: boolean) => DailyNoteModel.find({
  noteDate: monthBounds(month), hiddenAt: hidden ? { $ne: null } : null,
}).sort({ noteDate: -1, updatedAt: -1 }).lean();
const createNote = async (payload: Record<string, unknown>) => {
  validatePayload(payload, ["title", "content", "noteDate"]);
  return DailyNoteModel.create(payload);
};
const updateNote = (id: string, payload: Record<string, unknown>) => update(DailyNoteModel, id, payload);

const getGoals = async (hidden: boolean) => GoalModel.find({ hiddenAt: hidden ? { $ne: null } : null }).sort({ dueAt: 1 }).lean();
const createGoal = async (payload: Record<string, unknown>) => {
  validatePayload(payload, ["title", "startsAt", "dueAt"]);
  if (new Date(String(payload.dueAt)) < new Date(String(payload.startsAt))) {
    throw Object.assign(new Error("dueAt must be on or after startsAt"), { statusCode: 400 });
  }
  return GoalModel.create(payload);
};
const updateGoal = (id: string, payload: Record<string, unknown>) => update(GoalModel, id, payload);

const setHidden = async (kind: Kind, id: string, hidden: boolean) => {
  assertId(id);
  const result = await models[kind].findByIdAndUpdate(id, { hiddenAt: hidden ? new Date() : null }, { new: true });
  if (!result) throw Object.assign(new Error("Record not found"), { statusCode: 404 });
  return result;
};

const deletePermanently = async (kind: Kind, id: string) => {
  assertId(id);
  const result = await models[kind].findByIdAndDelete(id);
  if (!result) throw Object.assign(new Error("Record not found"), { statusCode: 404 });
  return result;
};

export const privateToolsService = {
  getExpenses, createExpense, updateExpense,
  getNotes, createNote, updateNote,
  getGoals, createGoal, updateGoal, setHidden, deletePermanently,
};