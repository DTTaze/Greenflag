import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { FORUM_VOTE_TYPE } from '@shared/enums';

export class CreateCommentDTO {
  @ApiProperty({
    example:
      'Bà con nên dùng thuốc đặc trị vi khuẩn kết hợp với trừ nấm đạo ôn.',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 1000)
  content: string;

  @ApiPropertyOptional({ example: 'a0b1c2d3-e4f5-6789-0123-456789abcdef' })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === 'null' || value === 'undefined'
      ? undefined
      : value,
  )
  @IsUUID()
  parentId?: string;
}

export class UpdateCommentDTO {
  @ApiProperty({ example: 'Nội dung bình luận đã cập nhật...' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 1000)
  content: string;
}

export class GetCommentsQueryDTO {
  @ApiPropertyOptional({
    description: 'Pagination cursor (ISO String of createdAt)',
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({ default: 3, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 3;
}

export class VoteCommentDTO {
  @ApiProperty({ example: FORUM_VOTE_TYPE.UP, enum: FORUM_VOTE_TYPE })
  @IsNotEmpty()
  @IsEnum(FORUM_VOTE_TYPE, { message: 'Vote type không hợp lệ' })
  type: FORUM_VOTE_TYPE;
}

export class FindOneCommentParamDTO {
  @ApiProperty({ description: 'The UUID of the comment' })
  @IsUUID()
  id: string;
}
