import { VerifyUser } from './src/application/use-cases/VerifyUser';
import { DatabaseConnection } from './src/infrastructure/database/Connection';
import { Server } from './src/presentation/Server';
import run from './src/presentation/consumers/NotificationConsumer';
import { VerifyUserController } from './src/presentation/controllers/VerifyUserController';

export async function main(): Promise<void> {
  await DatabaseConnection.connect();

  const verifyUser = new VerifyUser();

  const verifyUserController = new VerifyUserController(verifyUser);

  run();

  await Server.run(7000, { verifyUserController });
}

main();
