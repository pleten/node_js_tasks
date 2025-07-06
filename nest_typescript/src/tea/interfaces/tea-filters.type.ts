import { Pagination } from './pagination.type';

export interface TeaFilters extends Partial<Pagination> {
  minRating?: number;
}
