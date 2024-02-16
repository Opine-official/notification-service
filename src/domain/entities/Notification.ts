import { randomUUID } from 'crypto';
import { Schema } from 'mongoose';
import {
  EntityType,
  NotificationType,
} from '../../infrastructure/models/NotificationModel';

type NotificationParams = {
  notificationId?: string;
  type: NotificationType;
  entityType: EntityType;
  entityData: Schema.Types.Mixed;
  senderId: string;
  message: string;
  userId: string;
  read?: boolean;
};

export class Notification {
  notificationId: string;
  type: NotificationType;
  entityType: EntityType;
  entityData: Schema.Types.Mixed;
  senderId: string;
  message: string;
  userId: string;
  read: boolean;

  constructor({
    notificationId = randomUUID(),
    type,
    entityType,
    entityData,
    senderId,
    message,
    userId,
    read = false,
  }: NotificationParams) {
    this.notificationId = notificationId;
    this.type = type;
    this.entityType = entityType;
    this.entityData = entityData;
    this.senderId = senderId;
    this.message = message;
    this.userId = userId;
    this.read = read;
  }
}
