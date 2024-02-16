import { Schema } from 'mongoose';
import { Notification } from '../../domain/entities/Notification';
import { NotificationRepository } from '../../infrastructure/repositories/NotificationRepository';
import {
  EntityType,
  NotificationType,
} from '../../infrastructure/models/NotificationModel';

interface ISaveNotificationDTO {
  notificationId?: string;
  type: NotificationType;
  entityType: EntityType;
  entityData: Schema.Types.Mixed;
  senderId: string;
  message: string;
  userId: string;
}

export class SaveNotification {
  private notificationRepository: NotificationRepository;

  constructor(notificationRepository: NotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  public async execute({
    type,
    entityType,
    entityData,
    senderId,
    message,
    userId,
  }: ISaveNotificationDTO): Promise<Error | void> {
    const notification = new Notification({
      type,
      entityType,
      entityData,
      senderId,
      message,
      userId,
    });

    return this.notificationRepository.save(notification);
  }
}
