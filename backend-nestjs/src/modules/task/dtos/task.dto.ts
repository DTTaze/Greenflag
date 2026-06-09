import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  TASK_DIFFICULTY,
  TASK_SUBMIT_STATUS,
  TASK_VISIBILITY,
} from '@shared/enums';

export class CreateTaskDto {
  @ApiProperty({ example: 'Complete a survey' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Optional task content' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ example: 'Submit your survey response' })
  @IsString()
  description: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  coins: number;

  @ApiProperty({ enum: TASK_DIFFICULTY, example: TASK_DIFFICULTY.EASY })
  @IsEnum(TASK_DIFFICULTY)
  difficulty: TASK_DIFFICULTY;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  total?: number;

  @ApiPropertyOptional({ type: [String], example: ['uuid-1'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  typeIds?: string[];
}

export class UpdateTaskDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  coins?: number;

  @ApiPropertyOptional({ enum: TASK_DIFFICULTY })
  @IsOptional()
  @IsEnum(TASK_DIFFICULTY)
  difficulty?: TASK_DIFFICULTY;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  total?: number;

  @ApiPropertyOptional({ enum: TASK_VISIBILITY })
  @IsOptional()
  @IsEnum(TASK_VISIBILITY)
  status?: TASK_VISIBILITY;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  typeIds?: string[];
}

export class SubmitTaskDto {
  @ApiPropertyOptional({ example: 'Completed task successfully' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class DecisionTaskSubmitDto {
  @ApiProperty({
    enum: TASK_SUBMIT_STATUS,
    example: TASK_SUBMIT_STATUS.APPROVED,
  })
  @IsEnum(TASK_SUBMIT_STATUS)
  decision: TASK_SUBMIT_STATUS;
}

export class ChangeTaskStatusDto {
  @ApiProperty({ enum: TASK_VISIBILITY, example: TASK_VISIBILITY.PUBLIC })
  @IsEnum(TASK_VISIBILITY)
  status: TASK_VISIBILITY;
}
