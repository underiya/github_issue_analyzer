export class ScanRequestDto {
  repo: string;
}

export class ScanResponseDto {
  repo: string;
  issues_fetched: number;
  cached_successfully: boolean;
}

export class AnalyzeRequestDto {
  repo: string;
  prompt: string;
}

export class AnalyzeResponseDto {
  analysis: string;
}
