import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private provider: string;
  private enabled: boolean;

  constructor(private config: ConfigService) {
    this.provider = this.config.get('SMS_PROVIDER', 'none');
    this.enabled = this.provider !== 'none' && this.provider !== '';
    this.logger.log(`SMS service initialized: provider=${this.provider}, enabled=${this.enabled}`);
  }

  /**
   * Send an OTP to a mobile number.
   * Supports MSG91 (GoI-approved) and Fast2SMS via SMS_PROVIDER env var.
   */
  async sendOtp(mobile: string, otp: string): Promise<boolean> {
    if (!this.enabled) {
      this.logger.log(`[SMS-DISABLED] OTP ${otp} for ${mobile}`);
      return false;
    }

    try {
      switch (this.provider) {
        case 'msg91':
          return this.sendViaMSG91(mobile, otp);
        case 'fast2sms':
          return this.sendViaFast2SMS(mobile, otp);
        default:
          this.logger.warn(`Unknown SMS_PROVIDER: ${this.provider}`);
          return false;
      }
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${mobile}: ${error.message}`);
      return false;
    }
  }

  /**
   * MSG91 — Government of India approved SMS gateway
   * Requires: MSG91_AUTH_KEY, MSG91_TEMPLATE_ID
   */
  private async sendViaMSG91(mobile: string, otp: string): Promise<boolean> {
    const authKey = this.config.get<string>('MSG91_AUTH_KEY');
    const templateId = this.config.get<string>('MSG91_TEMPLATE_ID');

    if (!authKey || !templateId) {
      this.logger.error('MSG91_AUTH_KEY or MSG91_TEMPLATE_ID not configured');
      return false;
    }

    const response = await fetch(
      `https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=91${mobile}&otp=${otp}`,
      {
        method: 'POST',
        headers: {
          authkey: authKey,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      this.logger.error(`MSG91 error: ${response.status} ${await response.text()}`);
      return false;
    }

    this.logger.log(`OTP sent via MSG91 to ${mobile}`);
    return true;
  }

  /**
   * Fast2SMS — Indian SMS provider (requires vendor approval for GoI)
   * Requires: FAST2SMS_API_KEY
   */
  private async sendViaFast2SMS(mobile: string, otp: string): Promise<boolean> {
    const apiKey = this.config.get<string>('FAST2SMS_API_KEY');

    if (!apiKey) {
      this.logger.error('FAST2SMS_API_KEY not configured');
      return false;
    }

    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: apiKey,
      },
      body: JSON.stringify({
        route: 'otp',
        variables_values: otp,
        numbers: mobile,
      }),
    });

    if (!response.ok) {
      this.logger.error(`Fast2SMS error: ${response.status} ${await response.text()}`);
      return false;
    }

    this.logger.log(`OTP sent via Fast2SMS to ${mobile}`);
    return true;
  }
}
