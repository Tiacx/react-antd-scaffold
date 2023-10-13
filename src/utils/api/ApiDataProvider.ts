import { AnyObject } from "antd/es/_util/type"
import DataProvider from "./DataProvider"
import DataProviderInterface from "./DataProviderInterface"
import { dataGet } from "../functions"

interface ApiDataProviderConfig {
  service: AnyObject
  method : string
  params?: AnyObject
  pageKey?: string
  pageSizeKey?: string
  dataPath?: string
  totalCountPath?: string
}

export default class ApiDataProvider extends DataProvider implements DataProviderInterface {
  service: AnyObject
  method : string
  params: AnyObject
  lastParams: AnyObject
  pageKey: string
  pageSizeKey: string
  dataPath: string
  totalCountPath: string
  refreshHandler: CallableFunction

  constructor(config: ApiDataProviderConfig) {
    super();
    this.service = config.service;
    this.method = config.method;
    this.params = config.params || {};
    this.pageKey = config.pageKey || 'page';
    this.pageSizeKey = config.pageSizeKey || 'per_page';
    this.dataPath = config.dataPath || 'data'
    this.totalCountPath = config.totalCountPath || 'meta.total'
    this.lastParams = {};
    this.refreshHandler = () => {};
  }

  getKey(): string {
    return this.service.key;
  }

  filter(params: AnyObject, page?: number, pageSize?: number, cb?: CallableFunction): void {
    params = {...this.params, ...params};
    if (page != undefined) params[this.pageKey] = page;
    if (pageSize != undefined) params[this.pageSizeKey] = pageSize;

    this.setPage(params[this.pageKey]);
    this.setPageSize(params[this.pageSizeKey]);
    this.lastParams = params;

    this.service[this.method].apply(null, [params]).then((response: AnyObject)=>{
      this.setData(dataGet(response, this.dataPath, null) as AnyObject[] | undefined);
      this.setTotalCount(dataGet(response, this.totalCountPath, 0) as number);
      if (cb != undefined) cb(response);
    });
  }

  refresh(): void {
    this.refreshHandler(this.lastParams);
  }

  setRefreshHandler(refreshHandler: CallableFunction): void
  {
    this.refreshHandler = refreshHandler;
  }
}
