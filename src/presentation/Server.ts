import express from 'express';
import cors from 'cors';
import { VerifyUserController } from './controllers/VerifyUserController';
import cookieParser from 'cookie-parser';
import { Server as SocketServer } from 'socket.io';
import http from 'http';
import { GetUserNotificationsController } from './controllers/GetUserNotificationsController';
import { authenticateRole } from '@opine-official/authentication';
import { MarkNotificationsAsReadController } from './controllers/MarkNotificationsAsReadController';
import { checkUserTokenVersion } from '../infrastructure/middlewares/checkTokenVersion';

interface ServerControllers {
  verifyUserController: VerifyUserController;
  getUserNotificationsController: GetUserNotificationsController;
  markNotificationsAsReadController: MarkNotificationsAsReadController;
}

const allowedOrigins = [
  'https://localhost:3000',
  'https://www.opine.ink',
  'https://opine.ink',
];

const corsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200,
  credentials: true,
};

export class Server {
  private static instance: Server;
  private io: SocketServer | undefined;

  private constructor() {}

  public static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server();
    }

    return Server.instance;
  }

  public getIO(): SocketServer | undefined {
    return this.io;
  }

  public async run(
    port: number,
    controllers: ServerControllers,
  ): Promise<void> {
    const app = express();
    app.use(cookieParser());
    app.use(cors(corsOptions));
    app.options('*', cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get('/test', (req, res) => res.send('Notification service is running'));

    app.get('/verifyUser', (req, res) => {
      controllers.verifyUserController.handle(req, res);
    });

    app.get(
      '/user',
      authenticateRole('user'),
      checkUserTokenVersion,
      (req, res) => {
        controllers.getUserNotificationsController.handle(req, res);
      },
    );

    app.post(
      '/markAsRead',
      authenticateRole('user'),
      checkUserTokenVersion,
      (req, res) => {
        controllers.markNotificationsAsReadController.handle(req, res);
      },
    );

    const server = http.createServer(app);

    this.io = new SocketServer(server, {
      cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket) => {
      socket.on('join', async (room) => {
        socket.join(room);
      });
    });

    server.listen(port, () => {
      console.log(`Server is running in ${port}`);
    });
  }
}
