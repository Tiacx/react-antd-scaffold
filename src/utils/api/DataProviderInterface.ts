import { AnyObject } from "antd/es/_util/type"

export default interface DataProviderInterface {
  data: AnyObject[] | undefined
  page: number
  pageSize: number
  totalCount: number
  getKey(): string
  filter?(params: AnyObject, page?: number, pageSize?: number, cb?: CallableFunction): void
  getData(): AnyObject[] | undefined
  setData(data: AnyObject[] | undefined): void
  getPage(): number
  setPage(page: number): void
  getPageSize(): number
  setPageSize(pageSize: number): void
  getTotalCount(): number
  setTotalCount(totalCount: number): void
  refresh?(): void
  refreshHandler?: CallableFunction
  setRefreshHandler?(refreshHandler: CallableFunction): void
}
