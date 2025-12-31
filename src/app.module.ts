import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { DatabaseService } from './services/database.service';
import { GithubService } from './services/github.service';
import { LlmService } from './services/llm.service';
import { Repository, Issue } from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'github_issues.db',
      entities: [Repository, Issue],
      synchronize: true, // Auto-create tables in development
    }),
    TypeOrmModule.forFeature([Repository, Issue]),
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService, GithubService, LlmService],
})
export class AppModule {}
