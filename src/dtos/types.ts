// Shared types and interfaces
export interface GitHubIssue {
  id: number;
  title: string;
  body: string | null;
  html_url: string;
  created_at: string;
}
