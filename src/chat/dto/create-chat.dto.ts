import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateChatDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ArrayMinSize(1)
  recipients: string[];
}
