import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import { GitHubIssue } from '../dtos';
import { Logger } from '@nestjs/common';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private genAI: GoogleGenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    // console.log('Using API Key:', apiKey ? 'Present' : 'Missing');
    // console.log('Using API Key:', apiKey);

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    this.genAI = new GoogleGenAI({ apiKey });
  }

  async analyzeIssues(issues: GitHubIssue[], prompt: string): Promise<string> {
    if (issues.length === 0) {
      return 'No issues found to analyze.';
    }

    // Prepare the issues data for the LLM
    const issuesText = issues
      .map((issue, index) => {
        const body = issue.body
          ? issue.body.substring(0, 500) +
            (issue.body.length > 500 ? '...' : '')
          : 'No description';
        return `Issue ${index + 1}:
Title: ${issue.title}
Created: ${new Date(issue.created_at).toLocaleDateString()}
URL: ${issue.html_url}
Description: ${body}
---`;
      })
      .join('\n\n');

    const fullPrompt = `You are an expert software engineer analyzing GitHub issues. Provide insightful analysis based on the user's request. Be thorough but concise. Focus on actionable insights.

${prompt}

Here are the issues to analyze:

${issuesText}

Please provide your analysis:`;

    try {
      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
      });

      return response.text || 'No analysis generated.';
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`LLM analysis failed: ${message}`);
    }
  }
}
