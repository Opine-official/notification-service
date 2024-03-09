import { User } from '../../domain/entities/User';

export interface IUserRepository {
  save(user: User): Promise<void | Error>;
  compareTokenVersion(userId: string, tokenVersion: number): Promise<boolean>;
  updateTokenVersion(
    userId: string,
    tokenVersion: number,
  ): Promise<number | Error>;
}
