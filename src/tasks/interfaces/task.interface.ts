import { Document } from 'mongoose';

export interface ITask extends Document {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  status: string;
  user: string;
}
