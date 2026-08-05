import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from './entities/plan.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  create(createPlanDto: CreatePlanDto) {
    const plan = this.planRepository.create(createPlanDto);
    return this.planRepository.save(plan);
  }

  findAll() {
    return this.planRepository.find();
  }

  async findOne(id: number) {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException(`Plan #${id} no encontrado`);
    }
    return plan;
  }

  async update(id: number, updatePlanDto: UpdatePlanDto) {
    const plan = await this.findOne(id);
    Object.assign(plan, updatePlanDto);
    return this.planRepository.save(plan);
  }

  async remove(id: number) {
    const plan = await this.findOne(id);
    return this.planRepository.remove(plan);
  }
}
