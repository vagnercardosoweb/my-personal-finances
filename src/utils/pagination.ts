import { Request } from 'express';

type Properties = {
  page: number;
  limit: number;
};

type Result = {
  totalRows: number;
  totalPages: number;
  currentPage: number;
  nextPage: number;
  prevPage: number;
};

export class Pagination {
  protected page = 1;
  protected limit = 10;
  protected offset = 0;
  protected totalRows = 0;

  constructor({ page, limit }: Properties) {
    this.page = page;
    this.limit = limit;
    this.offset = (page - 1) * limit;
  }

  public static fromExpressRequest(request: Request) {
    return new Pagination({
      page: Number(request.query.page || 1),
      limit: Number(request.query.limit || 10),
    });
  }

  public setTotalRows(total: number) {
    this.totalRows = total;
  }

  public getTotalRows(): number {
    return this.totalRows;
  }

  public getCurrentPage(): number {
    return this.page;
  }

  public getLimit(): number {
    return this.limit;
  }

  public getOffset(): number {
    return this.offset;
  }

  public toJson(): Result {
    const totalPages = Math.max(Math.ceil(this.totalRows / this.limit));
    const nextPage = totalPages > this.page ? this.page + 1 : totalPages;
    const prevPage = this.page > 1 ? this.page - 1 : 1;

    return {
      totalRows: this.totalRows,
      totalPages,
      currentPage: this.page,
      nextPage,
      prevPage,
    };
  }
}
