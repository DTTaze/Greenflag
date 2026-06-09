import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { getStorageFolder } from '@shared/constants';

export class GetSignatureDto {
  @ApiProperty({
    description: 'Folder to upload files to',
    enum: getStorageFolder(),
  })
  @IsEnum(getStorageFolder())
  @IsNotEmpty()
  folder: string;
}

export class GetSignatureResponseDto {
  @ApiProperty({
    description: 'Folder to upload files to',
    enum: getStorageFolder(),
  })
  @IsEnum(getStorageFolder())
  @IsNotEmpty()
  folder: string;

  @ApiProperty({
    description: 'Signature to upload files to',
  })
  @IsString()
  @IsNotEmpty()
  signature: string;

  @ApiProperty({
    description: 'Timestamp to upload files to',
  })
  @IsString()
  @IsNotEmpty()
  timestamp: string;

  @ApiProperty({
    description: 'Cloud name to upload files to',
  })
  @IsString()
  @IsNotEmpty()
  cloudName: string;

  @ApiProperty({
    description: 'API key to upload files to',
  })
  @IsString()
  @IsNotEmpty()
  apiKey: string;
}
