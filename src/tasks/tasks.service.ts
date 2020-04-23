import { ITask } from './interfaces/task.interface';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(@InjectModel('Task') private readonly taskModel: Model<ITask>) {}

  async getAllTasks(): Promise<ITask[]> {
    return await this.taskModel.find();
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<ITask[]> {
    const { status, search } = filterDto;
    let tasks = await this.taskModel.find();
    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }
    if (search) {
      tasks = tasks.filter(
        task =>
          task.title.includes(search) || task.description.includes(search),
      );
    }
    return tasks;
  }

  async getTaskById(id: string): Promise<ITask> {
    try {
      const found = await this.taskModel.findById(id).exec();
      return found;
    } catch (error) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<ITask> {
    const { title, description } = createTaskDto;
    const task = new this.taskModel({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    console.log({ task });
    await task.save();

    return task;
  }

  async deleteTask(id: string): Promise<void> {
    await this.getTaskById(id);
    await this.taskModel.deleteOne({ _id: id });
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<ITask> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }
}
