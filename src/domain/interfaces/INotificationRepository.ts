import { Notification } from '../entities/Notification';

export interface INotificationRepository {
  get(notificationId: string): Promise<Notification | Error>;
  save(notification: Notification): Promise<Error | void>;
  update(notification: Notification): Promise<Error | void>;
  delete(notificationId: string): Promise<Error | void>;
  getUserNotifications(userId: string): Promise<Notification[] | Error>;
}
