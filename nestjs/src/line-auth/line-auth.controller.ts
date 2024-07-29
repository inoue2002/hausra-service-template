import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LineAuthService } from './line-auth.service';

@Controller('/verify')
export class LineAuthController {
  constructor(private readonly lineAuthService: LineAuthService) {}

  @Post()
  async verifyLineToken(
    @Body() body: { input: { idToken: string } },
    @Res() res: Response,
  ) {
    const { idToken } = body.input;

    console.log('DEBUG: Request Body: ', body);

    try {
      const firebaseToken = await this.lineAuthService.verifyLineToken(idToken);
      console.log('DEBUG: Firebase Token2: ', firebaseToken);
      return res.json({ firebaseToken });
    } catch (error) {
      console.error('ERROR: ', error);
      return res.status(400).json({ message: 'Token verification failed' });
    }
  }
}
