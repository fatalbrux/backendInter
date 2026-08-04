import { Module } from '@nestjs/common';
import { CalleService } from './calle.service';
import { CalleController } from './calle.controller';

@Module({
  controllers: [CalleController],
  providers: [CalleService],
})
export class CalleModule {}
