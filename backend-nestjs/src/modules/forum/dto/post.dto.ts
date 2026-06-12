import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  Min,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { FORUM_POST_STATUS, FORUM_VOTE_TYPE } from '@shared/enums';

export class CreatePostDTO {
  @ApiProperty({
    example:
      'Lúa bị đạo ôn kết hợp vi khuẩn thì xịt thuốc gì hiệu quả thưa các chuyên gia?',
  })
  @IsNotEmpty()
  @IsString()
  @Length(10, 5000)
  content: string;

  @ApiPropertyOptional({
    example: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(4)
  images?: string[];

  @ApiPropertyOptional({ example: ['Đạo ôn', 'Kỹ thuật'] })
  @IsOptional()
  @Transform(({ value, obj }) => {
    const rawTags = value ?? obj['tags[]'] ?? obj['tags'];
    let tagsArr: any[] = [];
    if (typeof rawTags === 'string') {
      tagsArr = [rawTags];
    } else if (Array.isArray(rawTags)) {
      tagsArr = rawTags;
    } else {
      return undefined;
    }

    return tagsArr
      .filter((t) => typeof t === 'string')
      .map((t) => {
        const clean = t.replace(/#/g, '').trim().replace(/\s+/g, ' ');
        if (clean.length > 0) {
          const formatted =
            clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
          return formatted.slice(0, 50);
        }
        return '';
      })
      .filter((t) => t.length > 0)
      .slice(0, 5);
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  @MaxLength(50, { each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: 'Hỏi đáp' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'Sống xanh' })
  @IsOptional()
  @IsString()
  category_id?: string;

  @ApiPropertyOptional({ example: 'Tái chế' })
  @IsOptional()
  @IsString()
  topic_id?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return false;
    return value === 'true' || value === true;
  })
  @IsBoolean()
  isDraft?: boolean;

  @ApiPropertyOptional({ example: ['username1', 'username2'] })
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      if (!value.trim()) return [];
      return value.split(',').map((v) => v.trim().replace('@', ''));
    }
    return value;
  })
  @IsArray()
  @ArrayMaxSize(10, { message: 'Chỉ được tag tối đa 10 người.' })
  @IsString({ each: true })
  taggedUsernames?: string[];

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsOptional()
  @IsUUID('4')
  attachedEventId?: string;
}

export class UpdatePostDTO {
  @ApiPropertyOptional({ example: 'Nội dung cập nhật của bài viết...' })
  @IsOptional()
  @IsString()
  @Length(10, 5000)
  content?: string;

  @ApiPropertyOptional({
    example: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(4)
  images?: string[];

  @ApiPropertyOptional({ example: ['Đạo ôn', 'Kỹ thuật'] })
  @IsOptional()
  @Transform(({ value, obj }) => {
    const rawTags = value ?? obj['tags[]'] ?? obj['tags'];
    let tagsArr: any[] = [];
    if (typeof rawTags === 'string') {
      tagsArr = [rawTags];
    } else if (Array.isArray(rawTags)) {
      tagsArr = rawTags;
    } else {
      return undefined;
    }

    return tagsArr
      .filter((t) => typeof t === 'string')
      .map((t) => {
        const clean = t.replace(/#/g, '').trim().replace(/\s+/g, ' ');
        if (clean.length > 0) {
          const formatted =
            clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
          return formatted.slice(0, 50);
        }
        return '';
      })
      .filter((t) => t.length > 0)
      .slice(0, 5);
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  @MaxLength(50, { each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: 'Hỏi đáp' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'Sống xanh' })
  @IsOptional()
  @IsString()
  category_id?: string;

  @ApiPropertyOptional({ example: 'Tái chế' })
  @IsOptional()
  @IsString()
  topic_id?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    return value === 'true' || value === true;
  })
  @IsBoolean()
  isDraft?: boolean;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000', nullable: true })
  @IsOptional()
  @Transform(({ value }) => (value === 'null' || value === null ? null : value))
  @IsUUID('4')
  attachedEventId?: string | null;
}

export class GetPostsQueryDTO {
  @ApiPropertyOptional({
    description: 'Base64 encoded composite cursor (e.g. score_createdAt)',
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({ default: 10, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ default: 'new', enum: ['new', 'hot'] })
  @IsOptional()
  @IsString()
  @IsIn(['new', 'hot'])
  sort?: 'new' | 'hot' = 'new';

  @ApiPropertyOptional({ description: 'Filter posts by tags' })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({ description: 'Filter posts by category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Filter posts by status',
    enum: FORUM_POST_STATUS,
  })
  @IsOptional()
  @IsEnum(FORUM_POST_STATUS, { message: 'Status không hợp lệ' })
  status?: FORUM_POST_STATUS;
}

export class VotePostDTO {
  @ApiProperty({ example: FORUM_VOTE_TYPE.UP, enum: FORUM_VOTE_TYPE })
  @IsNotEmpty()
  @IsEnum(FORUM_VOTE_TYPE, { message: 'Vote type không hợp lệ' })
  type: FORUM_VOTE_TYPE;
}

export class AiEnhancePostDTO {
  @ApiProperty({ example: 'Lúa nhà tôi bị vàng lá nhẹ ở phần ngọn...' })
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class FindOnePostParamDTO {
  @ApiProperty({ description: 'The UUID of the post' })
  @IsUUID()
  id: string;
}

export class GetMyPostsQueryDTO {
  @ApiPropertyOptional({ description: 'Filter posts by status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Search posts by keywords' })
  @IsOptional()
  @IsString()
  search?: string;
}
