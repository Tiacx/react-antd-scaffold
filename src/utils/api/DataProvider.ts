import { AnyObject } from "antd/es/_util/type";

export default class DataProvider
{
  data: AnyObject[] | undefined
  page: number
  pageSize: number
  totalCount: number

  constructor()
  {
    this.data = undefined;
    this.page = 1;
    this.pageSize = 10;
    this.totalCount = 0;
  }

  getKey(): string {
    return 'id';
  }

  getData(): AnyObject[] | undefined {
    return this.data;
  }

  setData(data: AnyObject[] | undefined): void {
    this.data = data;
  }

  getPage(): number {
    return this.page;
  }

  setPage(page: number): void {
    this.page = page;
  }

  getPageSize(): number {
    return this.pageSize;
  }

  setPageSize(pageSize: number): void {
    this.pageSize = pageSize;
  }

  getTotalCount(): number {
    return this.totalCount;
  }

  setTotalCount(totalCount: number): void {
    this.totalCount = totalCount;
  }
}
