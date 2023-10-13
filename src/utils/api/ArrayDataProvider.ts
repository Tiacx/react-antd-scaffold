import { AnyObject } from "antd/es/_util/type"
import DataProvider from "./DataProvider"
import DataProviderInterface from "./DataProviderInterface"

interface ArrayDataProviderConfig {
  key?: string
  data: AnyObject[]
  params?: AnyObject
}

export default class ArrayDataProvider extends DataProvider implements DataProviderInterface {
  key: string
  data: AnyObject[]
  refreshHandler: CallableFunction

  constructor(config: ArrayDataProviderConfig) {
    super();
    this.key = config.key ?? 'id';
    this.data = config.data;
    this.refreshHandler = () => {};
  }

  getKey(): string {
    return this.key;
  }

  refresh(): void {
    this.refreshHandler();
  }

  setRefreshHandler(refreshHandler: CallableFunction): void
  {
    this.refreshHandler = refreshHandler;
  }
}
