import * as mongoose from 'mongoose';
import { TaskStatus } from '../task-status.enum';

export const TaskSchema = new mongoose.Schema({
  // id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true, enum: Object.values(TaskStatus) },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

// TaskSchema.index({ email: 1 }, { unique: true });
