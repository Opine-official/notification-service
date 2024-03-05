import { NotificationRepository } from '../../infrastructure/repositories/NotificationRepository';

interface IMarkNotificationsAsReadDTO {
  notificationIds: string[];
}

export class MarkNotificationsAsRead {
  constructor(private readonly _notificationRepo: NotificationRepository) {}

  public async execute({
    notificationIds,
  }: IMarkNotificationsAsReadDTO): Promise<Error | void> {
    for (const notificationId of notificationIds) {
      const result = await this._notificationRepo.markAsRead(notificationId);
      if (result instanceof Error) {
        return result;
      }
    }
  }
}
