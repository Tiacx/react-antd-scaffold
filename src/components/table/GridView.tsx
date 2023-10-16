import { Button, DatePicker, FormInstance, Input, Table, TableProps } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { ColumnType, TablePaginationConfig } from "antd/es/table";
import DataProviderInterface from "@/utils/api/DataProviderInterface";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ColumnFilterItem, FilterDropdownProps } from "antd/es/table/interface";
import { dataGet } from "@/utils/functions";
import dayjs from "dayjs";
import { RangeValue } from 'rc-picker/lib/interface';

export interface GridViewColOptions {
  value: number | string
  label: string
}

export type GridViewColType = ColumnType<AnyObject> & {
  filter?: boolean
  filterType?: 'input' | 'date'
  options?: Array<GridViewColOptions>
  noWrap?: boolean
  searchForm?: FormInstance
};

type GridViewCols = { [key: string]: string | GridViewColType };
export type { GridViewCols };

export interface GridViewProps<RecordType> extends TableProps<RecordType> {
  cols?: GridViewCols
  dataProvider?: DataProviderInterface
  pagination?: TablePaginationConfig | false
  align?: 'left' | 'center' | 'right'
  noWrap?: boolean
  refresh?: number
}

// 文件篩選
const filterInputDropdown = (filterProps: FilterDropdownProps) => {
  const onConfirm = () => {
    filterProps.confirm();
  };
  const onReset = () => {
    if (filterProps.clearFilters) {
      filterProps.clearFilters();
      filterProps.confirm();
    } else {
      filterProps.setSelectedKeys([]);
      filterProps.close();
    }
  };
  return (
    <div className="w-50 p-2">
      <Input
        placeholder="請輸入關鍵字"
        value={filterProps.selectedKeys[0]}
        onChange={(e) => filterProps.setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={onConfirm}
      />
      <div className="mt-1 flex space-x-2">
        <Button type="primary" className="text-xs w-1/2 h-7" onClick={onConfirm}>確認</Button>
        <Button type="default" className="text-xs w-1/2 h-7" onClick={onReset}>重置</Button>
      </div>
    </div>
  );
};
// 日期篩選
const filterDateDropdown = (filterProps: FilterDropdownProps) => {
  const onChange = (values: RangeValue<dayjs.Dayjs>) => {
    if (values && values[0] && values[1]) {
      filterProps.setSelectedKeys([
        values[0].format('YYYY-MM-DD'),
        values[1].format('YYYY-MM-DD')
      ]);
      filterProps.confirm();
    } else if (filterProps.clearFilters) {
      filterProps.clearFilters();
      filterProps.confirm();
    }
  };
  return (
    <div className="w-50 p-2">
      <DatePicker.RangePicker onChange={onChange} />
    </div>
  );
};

export const GridView = (props: GridViewProps<AnyObject>) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<AnyObject[] | undefined>(props.dataProvider?.getData());
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);

  // 數據提供者
  const dataProvider = props.dataProvider as DataProviderInterface;

  // 獲取數據
  const getPageData = useCallback((params: AnyObject, page?: number, pageSize?: number) => {
    if (dataProvider.filter != undefined) {
      setLoading(true);
      dataProvider.filter(params, page, pageSize, () => {
        setData(dataProvider.getData());
        setTotalCount(dataProvider.getTotalCount());
        setLoading(false);
      });
    }
  }, [dataProvider]);

  // 表格配置
  const tableProps = useMemo(() => {
    const tableProps = Object.assign({}, props);

    // 數據主鍵
    if (tableProps.rowKey == undefined && dataProvider) {
      tableProps.rowKey = dataProvider.getKey();
    }

    // 列字段
    if (props.columns == undefined && props.cols != undefined) {
      const columns: GridViewColType[] = [];
      for (const [key, value] of Object.entries(props.cols)) {
        let column: GridViewColType = {};
        if (typeof (value) == 'string') {
          const [title, ...rest] = value.split('|');
          column.title = title;
          rest.forEach((v) => Object.defineProperty(column, v, { configurable: true, value: true }));
        } else {
          column = value;
        }
        column.key = column.key || key;
        column.dataIndex = column.dataIndex || key;
        column.align = column.align || props.align || 'left'; // 對齊方式
        if (column.options != undefined) { // 枚舉
          column.render = (v) => column.options?.find(item => item.value == v)?.label;
        }
        if (column.noWrap ?? (props.noWrap ?? false) === true) { // 是否換行
          column.className = column.className ? column.className + ' whitespace-nowrap' : 'whitespace-nowrap';
        }
        if (column.filter === true && column.filterDropdown == undefined) { // 篩選
          if (column.options) {
            column.filters = column.options.map((item): ColumnFilterItem => {
              return { text: item.label, value: item.value };
            });
          } else {
            column.filterDropdown = column.filterType == 'date' ? filterDateDropdown : filterInputDropdown;
          }
          // 默認單選
          if (column.filterMultiple == undefined) column.filterMultiple = false;
        }
        columns.push(column);
      }
      tableProps.columns = columns;
    }

    // 分頁配置
    if (tableProps.pagination !== false) {
      let [defaultCurrent, defaultPageSize] = [1, 10];
      if (props.pagination !== false) {
        defaultCurrent = props.pagination?.defaultCurrent || defaultCurrent;
        defaultPageSize = props.pagination?.defaultPageSize || defaultPageSize;
      }
      const defaultPagination: TablePaginationConfig = {
        position: ['bottomCenter'],
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
        showSizeChanger: true,
        showQuickJumper: true,
        defaultCurrent: defaultCurrent,
        defaultPageSize: defaultPageSize,
      };
      tableProps.pagination = Object.assign(defaultPagination, tableProps.pagination);
    }

    // 篩選、排序、分頁
    if (dataProvider.filter != undefined) {
      tableProps.onChange = (pagination: TablePaginationConfig, filters: AnyObject, sorter: AnyObject) => {
        const params: AnyObject = {};
        params.filters = {};
        for (const [k, v] of Object.entries(filters)) {
          if (v == null) continue;
          const colProps = dataGet(props.cols || {}, k, {}) as AnyObject;
          if (colProps.filterType == 'date') {
            params.filters['start_' + k] = v[0];
            params.filters['end_' + k] = v[1];
          } else {
            params.filters[k] = colProps.filterMultiple === true ? v.join(',') : v[0];
          }
        }
        if (sorter.column != undefined) {
          params.sort = sorter.field;
          params.order = sorter.order == 'ascend' ? 'desc' : 'asc';
        }
        const currentPage = pagination.pageSize == dataProvider.getPageSize() ? pagination.current || 1 : 1;
        const newPageSize = pagination.pageSize as number;
        setCurrent(currentPage);
        setPageSize(newPageSize)
        if (newPageSize < dataProvider.getPageSize()) setData([]);
        getPageData(params, currentPage, newPageSize);
      };
    }

    delete tableProps.cols;
    delete tableProps.dataProvider;
    delete tableProps.align;
    delete tableProps.noWrap;
    return tableProps;
  }, [props, dataProvider, getPageData]);

  // Loading
  tableProps.loading = loading;
  // 數據源
  tableProps.dataSource = data;
  // 分頁
  const pagination = tableProps.pagination as TablePaginationConfig;

 if (pagination && dataProvider.filter !== undefined) {
    pagination.current = current;
    pagination.pageSize = pageSize;
    pagination.total = totalCount;
  }

  // 初始化
  useEffect(() => {
    setCurrent(pagination.defaultCurrent || 1);
    setPageSize(pagination.defaultPageSize || 10);
    getPageData({}, pagination.defaultCurrent, pagination.defaultPageSize);

    if (dataProvider.setRefreshHandler) {
      dataProvider.setRefreshHandler((lastParams: AnyObject) => {
        getPageData(lastParams);
      });
    }
  }, [getPageData, dataProvider, pagination.defaultCurrent, pagination.defaultPageSize]);

  return (
    <Table {...tableProps} />
  );
}
