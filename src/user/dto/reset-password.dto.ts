import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'ersatdyfgujh', required: true })
  token: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'newPassword123', required: true })
  newPassword: string;
}
