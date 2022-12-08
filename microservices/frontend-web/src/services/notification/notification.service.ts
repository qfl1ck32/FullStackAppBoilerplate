import { Injectable } from '@libs/di/decorators';
import { toast } from 'react-toastify';

@Injectable()
export class NotificationService {
  public show = toast;
}
