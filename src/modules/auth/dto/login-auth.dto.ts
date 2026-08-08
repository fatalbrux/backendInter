import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, minLength } from "class-validator";

export class LoginAuthDto{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}