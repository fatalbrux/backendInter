import { Test, TestingModule } from '@nestjs/testing';
import { InstalacionController } from './instalacion.controller';
import { InstalacionService } from './instalacion.service';

describe('InstalacionController', () => {
  let controller: InstalacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstalacionController],
      providers: [InstalacionService],
    }).compile();

    controller = module.get<InstalacionController>(InstalacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
