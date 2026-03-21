import { APCDCategory } from '@apcd/database';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { Public } from '../../common/decorators/public.decorator';

import { ApcdTypesService } from './apcd-types.service';

@ApiTags('APCD Types')
@Controller('apcd-types')
@UseInterceptors(CacheInterceptor)
@CacheTTL(300000) // 5 minutes — master data rarely changes
export class ApcdTypesController {
  constructor(private apcdTypesService: ApcdTypesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all APCD types (master data)' })
  async findAll() {
    return this.apcdTypesService.findAll();
  }

  @Public()
  @Get('grouped')
  @ApiOperation({ summary: 'Get APCD types grouped by category' })
  async findGrouped() {
    return this.apcdTypesService.findGroupedByCategory();
  }

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get APCD categories with their types' })
  async findCategories() {
    return this.apcdTypesService.findCategoriesWithTypes();
  }

  @Public()
  @Get('by-category')
  @ApiOperation({ summary: 'Get APCD types by category' })
  async findByCategory(@Query('category') category: APCDCategory) {
    return this.apcdTypesService.findByCategory(category);
  }
}
