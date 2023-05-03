import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common'
import { DeepPartial, Repository } from 'typeorm';
@Injectable()
export abstract class CrudService<T ,createDto,UpdateDto> {
  constructor(
   private readonly repository: Repository<T>,
  ) {}
  

  async findAll(): Promise<T[]> {
    try {
    return this.repository.find();
  }catch (error) {
    throw new BadGatewayException(error);
}
}

  /*async findOne(id: number): Promise<T> {
    try {
		  
	} catch (error) {
		throw new BadGatewayException(error);
	}
    return this.repository.findOne({where :{id}});
  }*/
  async create(Dto :createDto ): Promise<T> {
    return await this.repository.save(Dto as DeepPartial<T>);
  }
  async findOne(id: number): Promise<T> {
    const entity = await this.repository.createQueryBuilder()
    .where('id = :id', { id })
    .getOne();
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} is not found`);
    }
    return entity;
  }

  async update(id: number, updateDto:UpdateDto): Promise<T> {
   // await this.repository.update(id, Dto);
   const entity=await this.repository.preload({
    id,
    ...(updateDto as DeepPartial<T>)
  });
  console.log(entity);
    return await this.repository.save(entity);
  }
  
  async delete(id: number): Promise<void> {
    try {
		this.repository.delete(id)
	} catch (error) {
		throw new BadGatewayException(error);
	}
  }
  async DeleteTodoByIdv2(id: number){
    return await this.repository.softDelete(id);
    }
async RestoreTodoByIdv2(id: number) {
    return await this.repository.restore(id);
    }
}
