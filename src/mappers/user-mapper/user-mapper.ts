import { injectable } from "inversify";
import { IUserMapper } from "./user-mapper-interface";
import { IUserDto } from "src/models/user-dto/user-dto-interface";
import { IUser } from "src/models/user/user-interface";
import { UserDto } from "src/models/user-dto/user-dto";
import { User } from "src/models/user/user";

@injectable()
export class UserMapper implements IUserMapper {
    toDa(domain: IUser): IUserDto {
        return new UserDto(
            domain.id,
            domain.username,
            domain.givenName,
            domain.familyName,
            domain.email,
            domain.phoneNumber,
            domain.dateOfBirth?.toISOString(),
            domain.middleName,
        );
    }

    toDomain(da: IUserDto): IUser {
        return new User(
            da.id,
            da.username,
            da.givenName,
            da.familyName,
            da.email,
            da.phoneNumber,
            da.dateOfBirth ? new Date(Date.parse(da.dateOfBirth)) : null,
            da.middleName,
        );
    }
}
