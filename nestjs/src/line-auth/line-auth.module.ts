import { Module } from '@nestjs/common';
import { FirebaseModule } from '../firebase/firebase.module';
import { LineAuthService } from './line-auth.service';
import { LineAuthController } from './line-auth.controller';

@Module({
  imports: [FirebaseModule],
  providers: [LineAuthService],
  controllers: [LineAuthController],
  exports: [LineAuthService],
})
export class LineAuthModule {}
