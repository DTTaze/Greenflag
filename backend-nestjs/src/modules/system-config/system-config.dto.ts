import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateSystemConfigDto {
  @ApiProperty({
    description: 'The unique configuration key',
    example: 'CONFIDENCE_THRESHOLD',
  })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    description: 'The configuration value',
    example: '0.75',
  })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({
    description: 'A brief description of the configuration',
    example: 'Minimum confidence score to show predictions',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Whether the configuration is active',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateSystemConfigDto {
  @ApiProperty({
    description: 'The configuration value',
    example: '0.80',
  })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({
    description: 'A brief description of the configuration',
    example: 'Minimum confidence score to show predictions',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Whether the configuration is active',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
