import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Roles } from '@shared/decorators/roles.decorator';
import { ROLE } from '@shared/enums';
import { AuthGuard } from '@shared/guards/auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';

import { UpdateSystemConfigDto } from './system-config.dto';
import { SystemConfigService } from './system-config.service';

@ApiTags('Admin System Config')
@ApiBearerAuth()
@Controller('admin/system-configs')
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLE.ADMIN)
export class SystemConfigController {
  constructor(private readonly configService: SystemConfigService) {}

  @Get()
  @ApiOperation({ summary: 'Get all system configurations' })
  async getAll() {
    const res = await this.configService.findAll();
    return res;
  }

  @Patch(':key')
  @ApiOperation({ summary: 'Update system configuration by key' })
  async updateByKey(
    @Param('key') key: string,
    @Body() dto: UpdateSystemConfigDto,
  ) {
    const res = await this.configService.updateByKey(key, dto);
    return res;
  }
}
