import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class RegisterEmployeeDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  nationalId: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  department: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  position: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  laptopManufacturer: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  laptopModel: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  serialNumber: string;

  @IsNotEmpty()
  @Matches(/^\+250\d{9}$/, {
    message:
      'Mobile number must start with "+250" and have 9 digits after that.',
  })
  readonly telephone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class UpdateUserDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  names: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ChangePasswordDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/, {
    message:
      "Password must have at least 6 characters, one symbol, one number, and one uppercase letter.",
  })
  readonly oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/, {
    message:
      "Password must have at least 6 characters, one symbol, one number, and one uppercase letter.",
  })
  readonly newPassword: string;
}

export class UpdateAvatarDTO {
  @IsUrl()
  @IsNotEmpty()
  url: string;
}
