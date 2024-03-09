import SaveUser from '../../application/use-cases/SaveUser';
import { SaveNotification } from '../../application/use-cases/SaveNotification';
import kafka from '../../infrastructure/brokers/kafka/config';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { NotificationRepository } from '../../infrastructure/repositories/NotificationRepository';
import {
  EntityType,
  NotificationType,
} from '../../infrastructure/models/NotificationModel';
import { io } from '../../../main';
import { UpdateTokenVersion } from '../../application/use-cases/UpdateTokenVersion';

const consumer = kafka.consumer({ groupId: 'notification-consumer-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'user-register-topic' });
  await consumer.subscribe({ topic: 'comment-create-topic' });
  await consumer.subscribe({ topic: 'user-login-topic' });

  const userRepository = new UserRepository();
  const notificationRepository = new NotificationRepository();

  const saveUser = new SaveUser(userRepository);
  const saveNotification = new SaveNotification(notificationRepository);
  const updateTokenVersion = new UpdateTokenVersion(userRepository);

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        'reached here': true,
        topic,
        partition,
        value: message?.value?.toString(),
      });

      if (!message?.value?.toString()) {
        return;
      }
      if (topic === 'user-register-topic') {
        const userData = JSON.parse(message?.value?.toString());

        const saveUserResult = await saveUser.execute(userData);

        if (saveUserResult instanceof Error) {
          console.error(saveUserResult);
          return;
        }
      } else if (topic === 'comment-create-topic') {
        const commentData = JSON.parse(message?.value?.toString());

        const saveNotificationResult = await saveNotification.execute({
          type: NotificationType.COMMENT,
          entityType: EntityType.POST,
          entityData: commentData,
          senderId: commentData.senderId,
          message: `You have a new comment`,
          userId: commentData.userId,
        });

        if (saveNotificationResult instanceof Error) {
          console.error(saveNotificationResult);
          return;
        }

        io?.to(commentData.userId).emit('new-notification', {
          message: `You have a new comment`,
        });
      } else if (topic === 'user-login-topic') {
        const userData = JSON.parse(message?.value?.toString());

        const updateTokenVersionResult =
          await updateTokenVersion.execute(userData);

        if (updateTokenVersionResult instanceof Error) {
          console.error(updateTokenVersionResult);
          return;
        }
      }
    },
  });
};

run().catch(console.error);

export default run;
