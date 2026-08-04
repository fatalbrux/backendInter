import { Test, TestingModule } from '@nestjs/testing';
import { TipoEquipoService } from './tipo-equipo.service';

describe('TipoEquipoService', () => {
  let service: TipoEquipoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoEquipoService],
    }).compile();

    service = module.get<TipoEquipoService>(TipoEquipoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
