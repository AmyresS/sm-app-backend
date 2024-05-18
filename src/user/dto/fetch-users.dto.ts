import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class FetchUsersDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ArrayMinSize(1)
  users: string[];
}
