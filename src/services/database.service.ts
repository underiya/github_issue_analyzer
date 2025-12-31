import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Repository as RepoEntity } from '../entities/repository.entity';
import { Issue } from '../entities/issue.entity';
import { GitHubIssue } from '../dtos';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(RepoEntity)
    private readonly repoRepository: Repository<RepoEntity>,
    @InjectRepository(Issue)
    private readonly issueRepository: Repository<Issue>,
  ) {}

  async getRepositoryId(repoName: string): Promise<number | null> {
    const repo = await this.repoRepository.findOne({
      where: { name: repoName },
    });
    return repo?.id || null;
  }

  async createRepository(repoName: string): Promise<number> {
    const repo = this.repoRepository.create({ name: repoName });
    const savedRepo = await this.repoRepository.save(repo);
    return savedRepo.id;
  }

  async saveIssues(repositoryId: number, issues: GitHubIssue[]): Promise<void> {
    // First, delete existing issues for this repository
    await this.issueRepository.delete({ repository_id: repositoryId });

    // Insert new issues
    const issuesToSave = issues.map((issue) => ({
      id: issue.id,
      repository_id: repositoryId,
      title: issue.title,
      body: issue.body || '',
      html_url: issue.html_url,
      created_at: new Date(issue.created_at),
    }));

    await this.issueRepository.save(issuesToSave);
  }

  async getIssuesByRepository(repoName: string): Promise<GitHubIssue[]> {
    const issues = await this.issueRepository
      .createQueryBuilder('issue')
      .innerJoin('issue.repository', 'repo')
      .where('repo.name = :repoName', { repoName })
      .orderBy('issue.created_at', 'DESC')
      .select([
        'issue.id',
        'issue.title',
        'issue.body',
        'issue.html_url',
        'issue.created_at',
      ])
      .getMany();

    return issues.map((issue) => ({
      id: issue.id,
      title: issue.title,
      body: issue.body,
      html_url: issue.html_url,
      created_at: issue.created_at.toISOString(),
    }));
  }
}
