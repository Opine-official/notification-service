import { Request, Response } from 'express';
import { IController } from '../../shared/interfaces/IController';
import { GetUserNotifications } from '../../application/use-cases/GetUserNotifications';

export class GetUserNotificationsController implements IController {
  public constructor(private readonly _useCase: GetUserNotifications) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const result = await this._useCase.execute({
      userId: req.user.userId,
    });

    if (result instanceof Error) {
      console.error(result);
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }

    res.status(200).send(result);
  }
}
