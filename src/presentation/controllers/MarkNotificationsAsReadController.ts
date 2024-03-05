import { Request, Response } from 'express';
import { IController } from '../../shared/interfaces/IController';
import { MarkNotificationsAsRead } from '../../application/use-cases/MarkNotificationsAsRead';

export class MarkNotificationsAsReadController implements IController {
  public constructor(private readonly _useCase: MarkNotificationsAsRead) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const { notificationIds } = req.body;

    if (!notificationIds) {
      res.status(400).json({ error: 'notificationIds are required' });
      return;
    }

    const result = await this._useCase.execute({ notificationIds });

    if (result instanceof Error) {
      console.error(result);
      res.status(400).json({ error: 'Something went wrong' });
      return;
    }

    res.status(200).send('Notifications marked as read');
  }
}
