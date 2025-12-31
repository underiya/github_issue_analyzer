import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from '../services/app.service';
import {
  ScanRequestDto,
  ScanResponseDto,
  AnalyzeRequestDto,
  AnalyzeResponseDto,
} from '../dtos';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('scan')
  async scanRepository(
    @Body() scanRequest: ScanRequestDto,
  ): Promise<ScanResponseDto> {
    return this.appService.scanRepository(scanRequest);
  }

  @Post('analyze')
  async analyzeIssues(
    @Body() analyzeRequest: AnalyzeRequestDto,
  ): Promise<AnalyzeResponseDto> {
    return this.appService.analyzeIssues(analyzeRequest);
  }
}
