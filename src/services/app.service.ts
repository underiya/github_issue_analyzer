import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { GithubService } from './github.service';
import { LlmService } from './llm.service';
import {
  ScanRequestDto,
  ScanResponseDto,
  AnalyzeRequestDto,
  AnalyzeResponseDto,
} from '../dtos';

@Injectable()
export class AppService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly githubService: GithubService,
    private readonly llmService: LlmService,
  ) {}

  async scanRepository(scanRequest: ScanRequestDto): Promise<ScanResponseDto> {
    try {
      const { repo } = scanRequest;

      // Parse repo name (owner/repo format)
      const [owner, repository] = repo.split('/');
      if (!owner || !repository) {
        throw new Error('Invalid repository format. Use owner/repository');
      }

      // Fetch issues from GitHub
      const issues = await this.githubService.fetchOpenIssues(
        owner,
        repository,
      );

      // Get or create repository in database
      let repositoryId = await this.databaseService.getRepositoryId(repo);
      if (!repositoryId) {
        repositoryId = await this.databaseService.createRepository(repo);
      }

      // Save issues to database
      await this.databaseService.saveIssues(repositoryId, issues);

      return {
        repo,
        issues_fetched: issues.length,
        cached_successfully: true,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to scan repository: ${message}`);
    }
  }

  async analyzeIssues(
    analyzeRequest: AnalyzeRequestDto,
  ): Promise<AnalyzeResponseDto> {
    try {
      const { repo, prompt } = analyzeRequest;

      // Get issues from database
      const issues = await this.databaseService.getIssuesByRepository(repo);

      if (issues.length === 0) {
        throw new Error(
          `No cached issues found for repository ${repo}. Please scan the repository first.`,
        );
      }

      // Analyze with LLM
      const analysis = await this.llmService.analyzeIssues(issues, prompt);

      return {
        analysis,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to analyze issues: ${message}`);
    }
  }
}
