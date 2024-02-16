import mongoose, { InferSchemaType, Schema } from 'mongoose';

export enum NotificationType {
  LIKE = 'like',
  COMMENT = 'comment',
  FOLLOW = 'follow',
  MENTION = 'mention',
}

export enum EntityType {
  POST = 'post',
  USER = 'user',
}

const NotificationSchema = new mongoose.Schema({
  notificationId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(NotificationType),
    required: true,
  },
  entityType: {
    type: String,
    enum: Object.values(EntityType),
    required: true,
  },
  entityData: {
    type: Schema.Types.Mixed,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export type Notification = InferSchemaType<typeof NotificationSchema>;

export const NotificationModel = mongoose.model(
  'Notification',
  NotificationSchema,
);
