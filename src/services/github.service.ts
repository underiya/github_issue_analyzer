import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { GitHubIssue } from '../dtos';

@Injectable()
export class GithubService {
  private readonly baseUrl = 'https://api.github.com';

  async fetchOpenIssues(owner: string, repo: string): Promise<GitHubIssue[]> {
    const issues: GitHubIssue[] = [];
    let page = 1;
    const perPage = 100;

    try {
      while (true) {
        const response: AxiosResponse<GitHubIssue[]> = await axios.get(
          `${this.baseUrl}/repos/${owner}/${repo}/issues`,
          {
            params: {
              state: 'open',
              per_page: perPage,
              page: page,
            },
            headers: {
              Accept: 'application/vnd.github.v3+json',
              'User-Agent': 'GitHub-Issue-Analyzer/1.0',
            },
          },
        );

        const pageIssues = response.data;
        if (pageIssues.length === 0) {
          break;
        }

        issues.push(...pageIssues);
        page++;

        // GitHub API rate limiting - be respectful
        if (pageIssues.length < perPage) {
          break;
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`Repository ${owner}/${repo} not found`);
        }
        if (error.response?.status === 403) {
          throw new Error('GitHub API rate limit exceeded or access denied');
        }
      }
      throw new Error(
        `Failed to fetch issues: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }

    return issues;
  }
}
