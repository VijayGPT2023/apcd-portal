import { Role, ApplicationStatus } from '@apcd/database';
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

import { ApplicationsService } from './applications.service';
import { ApplicationFilterDto } from './dto/application-filter.dto';
import { UpdateApplicationDto } from './dto/create-application.dto';
import { FeeCalculatorService } from './fee-calculator.service';

@ApiTags('Applications')
@ApiBearerAuth()
@Controller('applications')
export class ApplicationsController {
  constructor(
    private applicationsService: ApplicationsService,
    private feeCalculator: FeeCalculatorService,
  ) {}

  @Post()
  @Roles(Role.OEM)
  @ApiOperation({ summary: 'Create a new draft application' })
  async create(@CurrentUser() user: JwtPayload) {
    return this.applicationsService.create(user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List applications (role-filtered)' })
  async findAll(@Query() filter: ApplicationFilterDto, @CurrentUser() user: JwtPayload) {
    return this.applicationsService.findAll(filter, user.sub, user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get application details' })
  async findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.applicationsService.findById(id, user.sub, user.role);
  }

  @Put(':id')
  @Roles(Role.OEM)
  @ApiOperation({ summary: 'Update draft application (auto-save per step)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateApplicationDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.applicationsService.update(id, user.sub, dto);
  }

  @Post(':id/submit')
  @Roles(Role.OEM)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Submit application for review' })
  async submit(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.applicationsService.submit(id, user.sub);
  }

  @Post(':id/resubmit')
  @Roles(Role.OEM)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Resubmit application after addressing queries' })
  async resubmit(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.applicationsService.resubmit(id, user.sub);
  }

  @Post(':id/withdraw')
  @Roles(Role.OEM)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Withdraw application' })
  async withdraw(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.applicationsService.withdraw(id, user.sub, reason);
  }

  @Patch(':id/status')
  @Roles(Role.OFFICER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Change application status (officer/admin)' })
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: ApplicationStatus,
    @Body('remarks') remarks: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.applicationsService.changeStatus(id, status, user.sub, remarks);
  }

  @Get(':id/fees')
  @Roles(Role.OEM)
  @ApiOperation({ summary: 'Calculate fees for this application' })
  async calculateFees(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.feeCalculator.calculateForApplication(id, user.sub);
  }
}
