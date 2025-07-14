import { Injectable, Inject, HttpException } from '../../core/';

export interface Template {
  id: number;
  name: string;
  rating?: number;
}

@Injectable()
@Inject(Symbol('TempService'))
export class TemplateService {
  private data: Template[] = [{ id: 1, name: 'test', rating: 5 }];

  findAll(filters?: { minRating?: number }) {
    if (filters?.minRating) {
      return this.data.filter((item) =>
        item.rating && filters?.minRating
          ? item.rating >= filters.minRating
          : false,
      );
    }
    return this.data;
  }

  findOne(id: number) {
    const item = this.data.find((b) => b.id === id);
    if (!item) throw new HttpException(404, 'Item not found');
    return item;
  }

  create(name: string) {
    const temp = { id: Date.now(), name };
    this.data.push(temp);
    return temp;
  }
}
