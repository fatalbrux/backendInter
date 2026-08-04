import { Test, TestingModule } from '@nestjs/testing';
import { CalleController } from './calle.controller';
import { CalleService } from './calle.service';

describe('CalleController', () => {
  let controller: CalleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalleController],
      providers: [CalleService],
    }).compile();

    controller = module.get<CalleController>(CalleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
