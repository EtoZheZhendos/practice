import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { CommentsModule } from './comments/comments.module';
import { CategoriesModule } from './categories/categories.module';
import { ProjectsModule } from './projects/projects.module';
import { HistoryModule } from './history/history.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: './database.sqlite',
      autoLoadModels: true,
      synchronize: true,
      define: {
        underscored: false,
      },
    }),
    AuthModule,
    TasksModule,
    UsersModule,
    RolesModule,
    CommentsModule,
    CategoriesModule,
    ProjectsModule,
    HistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
