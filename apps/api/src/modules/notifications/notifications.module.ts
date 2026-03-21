import { Module, Global } from '@nestjs/common';

import { EmailService } from './channels/email.service';
import { SmsService } from './channels/sms.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Global()
@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, EmailService, SmsService],
  exports: [NotificationsService, EmailService, SmsService],
})
export class NotificationsModule {}
