import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDTO } from '../dto/';

@Injectable()
export class UsersService {
  private users: UserDTO[] = [];

  async findAll(
    params?: TeaFilters,
  ): Promise<{ teas: Tea[]; pagination: Pagination }> {
    let result = this.teas;
    const pagination = {
      page: params?.page || 1,
      pageSize: params?.pageSize || 100,
      total: result.length,
    };
    if (params?.minRating) {
      result = result.filter((item) => item.rating >= params?.minRating);
      pagination.total = result.length;
    }
    const paginatedResult: Tea[][] = [];
    for (let i = 0; i < result.length; i += pagination.pageSize) {
      const chunk: Tea[] = result.slice(i, i + pagination.pageSize);
      paginatedResult.push(chunk);
    }

    return { teas: paginatedResult[pagination.page - 1], pagination };
  }

  async findOne(id: number): Promise<Tea> {
    const tea = this.teas.find((t) => t.id === id);
    if (!tea) throw new NotFoundException('Tea not found');
    return tea;
  }

  async create(data: CreateTeaDto): Promise<Tea> {
    const tea: Tea = { id: Date.now(), ...data };
    this.teas.push(tea);
    return tea;
  }

  async update(id: number, data: CreateTeaDto): Promise<Tea> {
    const tea: Tea = { id: Date.now(), ...data };
    const teaIndex = this.teas.indexOf(this.teas.find((t) => t.id === id));
    if (teaIndex === -1) throw new NotFoundException('Tea not found');
    this.teas[teaIndex] = tea;
    return tea;
  }

  async delete(id: number): Promise<void> {
    this.teas = this.teas.filter((t) => t.id !== id);
  }
}
