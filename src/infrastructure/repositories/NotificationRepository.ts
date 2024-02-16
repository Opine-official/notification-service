import { NotificationModel } from '../models/NotificationModel';
import { INotificationRepository } from '../../domain/interfaces/INotificationRepository';
import { Notification } from '../../domain/entities/Notification';

export class NotificationRepository implements INotificationRepository {
  public async get(notificationId: string): Promise<Notification | Error> {
    try {
      const notificationDocument = await NotificationModel.findOne({
        notificationId: notificationId,
      });

      if (!notificationDocument) {
        throw new Error('Notification not found');
      }

      return new Notification({
        notificationId: notificationDocument.notificationId,
        type: notificationDocument.type,
        entityType: notificationDocument.entityType,
        entityData: notificationDocument.entityData,
        senderId: notificationDocument.senderId,
        message: notificationDocument.message,
        userId: notificationDocument.userId,
        read: notificationDocument.read,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong');
    }
  }

  public async save(notification: Notification): Promise<Error | void> {
    try {
      const notificationDocument = new NotificationModel({
        notificationId: notification.notificationId,
        type: notification.type,
        entityType: notification.entityType,
        entityData: notification.entityData,
        senderId: notification.senderId,
        message: notification.message,
        userId: notification.userId,
        read: notification.read,
      });

      await notificationDocument.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong');
    }
  }

  public async update(notification: Notification): Promise<Error | void> {
    try {
      await NotificationModel.updateOne(
        { notificationId: notification.notificationId },
        {
          message: notification.message,
          userId: notification.userId,
          read: notification.read,
        },
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong');
    }
  }

  public async delete(notificationId: string): Promise<Error | void> {
    try {
      await NotificationModel.deleteOne({ notificationId: notificationId });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong');
    }
  }
}
