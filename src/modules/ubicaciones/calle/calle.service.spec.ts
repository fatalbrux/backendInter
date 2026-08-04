import { Test, TestingModule } from '@nestjs/testing';
import { CalleService } from './calle.service';

describe('CalleService', () => {
  let service: CalleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalleService],
    }).compile();

    service = module.get<CalleService>(CalleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
