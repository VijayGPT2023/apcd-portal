import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

import { AuditReportsService } from './audit-reports.service';

@Controller('audit-reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
export class AuditReportsController {
  constructor(private auditReportsService: AuditReportsService) {}

  /**
   * Generate RTI (Right to Information) report
   */
  @Get('rti')
  async getRTIReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('entityType') entityType?: string,
  ) {
    return this.auditReportsService.generateRTIReport(
      new Date(startDate),
      new Date(endDate),
      entityType,
    );
  }

  /**
   * Generate CAG (Comptroller and Auditor General) report
   */
  @Get('cag/:financialYear')
  async getCAGReport(@Param('financialYear') financialYear: string) {
    return this.auditReportsService.generateCAGReport(financialYear);
  }

  /**
   * Generate compliance report
   */
  @Get('compliance')
  async getComplianceReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.auditReportsService.generateComplianceReport(
      new Date(startDate),
      new Date(endDate),
    );
  }

  /**
   * Generate user activity report
   */
  @Get('user-activity/:userId')
  async getUserActivityReport(
    @Param('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.auditReportsService.generateUserActivityReport(
      userId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  /**
   * Export report (placeholder for CSV/PDF)
   */
  @Get('export/:type/:format')
  async exportReport(
    @Param('type') type: string,
    @Param('format') format: string,
    @Res() res: Response,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('financialYear') financialYear?: string,
  ) {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    let data: any;
    switch (type) {
      case 'rti':
        data = await this.auditReportsService.generateRTIReport(start, end);
        break;
      case 'cag':
        if (!financialYear) {
          res.status(400).json({ error: 'financialYear required for CAG report' });
          return;
        }
        data = await this.auditReportsService.generateCAGReport(financialYear);
        break;
      case 'compliance':
        data = await this.auditReportsService.generateComplianceReport(start, end);
        break;
      default:
        res.status(400).json({
          error: `Unknown report type: ${type}`,
          supportedTypes: ['rti', 'cag', 'compliance'],
        });
        return;
    }

    if (format === 'csv') {
      const csv = this.convertToCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${type}-report-${Date.now()}.csv`);
      res.send(csv);
      return;
    }

    // Default: JSON
    res.json(data);
  }

  private convertToCSV(data: any): string {
    if (!data) return '';
    // Handle array of objects
    const items = Array.isArray(data) ? data : data.data || data.records || [data];
    if (items.length === 0) return '';

    const headers = Object.keys(items[0]);
    const rows = items.map((item: any) =>
      headers
        .map((h) => {
          const val = item[h];
          const str = val === null || val === undefined ? '' : String(val);
          return `"${str.replace(/"/g, '""')}"`;
        })
        .join(','),
    );
    return [headers.join(','), ...rows].join('\n');
  }
}
