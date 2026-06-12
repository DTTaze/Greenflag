import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { EVENT_STATUS } from '@shared/enums';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  coins: number;

  @IsDateString()
  @IsNotEmpty()
  end_sign: string;

  @IsDateString()
  @IsNotEmpty()
  start_time: string;

  @IsDateString()
  @IsNotEmpty()
  end_time: string;
}

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  coins?: number;

  @IsDateString()
  @IsOptional()
  start_time?: string;

  @IsDateString()
  @IsOptional()
  end_time?: string;

  @IsDateString()
  @IsOptional()
  end_sign?: string;

  @IsString()
  @IsOptional()
  status?: EVENT_STATUS;
}

export class CheckInOutDto {
  @IsString()
  @IsNotEmpty()
  event_id: string;

  @IsString()
  @IsNotEmpty()
  user_id: string;
}
