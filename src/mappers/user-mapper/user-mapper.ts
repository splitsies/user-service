import { injectable } from "inversify";
import { IUserMapper } from "./user-mapper-interface";
import { IUserDto } from "src/models/user-dto/user-dto-interface";
import { IUser } from "src/models/user/user-interface";
import { UserDto } from "src/models/user-dto/user-dto";
import { User } from "src/models/user/user";

@injectable()
export class UserMapper implements IUserMapper {
    toDtoModel(domainModel: IUser): IUserDto {
        return new UserDto(
            domainModel.id,
            domainModel.givenName,
            domainModel.familyName,
            domainModel.email,
            domainModel.phoneNumber,
            domainModel.dateOfBirth.toISOString(),
            domainModel.middleName,
        );
    }

    toDomainModel(dtoModel: IUserDto): IUser {
        return new User(
            dtoModel.id,
            dtoModel.givenName,
            dtoModel.familyName,
            dtoModel.email,
            dtoModel.phoneNumber,
            new Date(Date.parse(dtoModel.dateOfBirth)),
            dtoModel.middleName,
        );
    }
}
