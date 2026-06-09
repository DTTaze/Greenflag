import { IsInt, Min } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateCoinDto {
  @ApiProperty({ example: 100 })
  @IsInt({ message: 'Số coin phải là số nguyên' })
  @Min(0, { message: 'Số coin không được nhỏ hơn 0' })
  coins: number;
}
