import { Notification } from '../../domain/entities/Notification';
import { INotificationRepository } from '../../domain/interfaces/INotificationRepository';

interface IUserNotificationsDTO {
  userId: string;
}

export class GetUserNotifications {
  constructor(private readonly _notificationRepo: INotificationRepository) {}

  public async execute({
    userId,
  }: IUserNotificationsDTO): Promise<Notification[] | Error> {
    const result = await this._notificationRepo.getUserNotifications(userId);

    if (result instanceof Error) {
      return result;
    }

    return result;
  }
}
