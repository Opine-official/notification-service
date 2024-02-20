import { GetUserNotifications } from './src/application/use-cases/GetUserNotifications';
import { MarkNotificationsAsRead } from './src/application/use-cases/MarkNotificationsAsRead';
import { VerifyUser } from './src/application/use-cases/VerifyUser';
import { DatabaseConnection } from './src/infrastructure/database/Connection';
import { NotificationRepository } from './src/infrastructure/repositories/NotificationRepository';
import { Server } from './src/presentation/Server';
import run from './src/presentation/consumers/NotificationConsumer';
import { GetUserNotificationsController } from './src/presentation/controllers/GetUserNotificationsController';
import { MarkNotificationsAsReadController } from './src/presentation/controllers/MarkNotificationsAsReadController';
import { VerifyUserController } from './src/presentation/controllers/VerifyUserController';
import { Server as SocketServer } from 'socket.io';

export let io: SocketServer | undefined;

export async function main(): Promise<void> {
  await DatabaseConnection.connect();

  const notificationRepo = new NotificationRepository();

  const verifyUser = new VerifyUser();
  const getNotifications = new GetUserNotifications(notificationRepo);
  const markNotificationsAsRead = new MarkNotificationsAsRead(notificationRepo);

  const verifyUserController = new VerifyUserController(verifyUser);
  const getUserNotificationsController = new GetUserNotificationsController(
    getNotifications,
  );
  const markNotificationsAsReadController =
    new MarkNotificationsAsReadController(markNotificationsAsRead);

  run();

  const server = Server.getInstance();
  await server.run(7000, {
    verifyUserController,
    getUserNotificationsController,
    markNotificationsAsReadController,
  });
  io = server.getIO();
}

main();
