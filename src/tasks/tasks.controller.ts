import { UserSchema } from 'src/auth/schemas/user.schema';
import { ITask } from './interfaces/task.interface';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskSevice: TasksService) {}
  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: GetTasksFilterDto,
  ): Promise<ITask[]> {
    if (Object.keys(filterDto).length) {
      return this.taskSevice.getTasks(filterDto);
    } else {
      return this.taskSevice.getAllTasks();
    }
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<ITask> {
    return this.taskSevice.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<ITask> {
    return this.taskSevice.createTask(createTaskDto);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): Promise<void> {
    return this.taskSevice.deleteTask(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Promise<ITask> {
    return this.taskSevice.updateTaskStatus(id, status);
  }
}
