import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';

const environment = process.env.NODE_ENV || 'development';

@Module({
  imports: [
    TasksModule,

    ConfigModule.forRoot({
      envFilePath: `.env.${environment}`,
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_WRITE_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }),
    AuthModule,
  ],
})
export class AppModule {}
