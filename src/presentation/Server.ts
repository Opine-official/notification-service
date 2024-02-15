import express from 'express';
import cors from 'cors';
import { VerifyUserController } from './controllers/VerifyUserController';
import cookieParser from 'cookie-parser';
import { Server as SocketServer } from 'socket.io';
import http from 'http';

interface ServerControllers {
  verifyUserController: VerifyUserController;
}

const corsOptions = {
  origin: 'https://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true,
};

export class Server {
  public static async run(
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

    const server = http.createServer(app);

    const io = new SocketServer(server, {
      cors: {
        origin: 'https://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      socket.on('join', async (room) => {
        socket.join(room);
      });
    });

    server.listen(port, () => {
      console.log(`Server is running in ${port}`);
    });
  }
}
