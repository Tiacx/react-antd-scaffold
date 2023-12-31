import { Select, SelectProps, Spin } from "antd";
import { useCallback, useMemo, useState } from "react";
import { DefaultOptionType } from "antd/es/select";
import { callDelay } from "@/utils/functions";
import { AnyObject } from "antd/es/_util/type";
import Api from "@/utils/api/Api";

export interface SelectPagination {
  pageKey?: string
  pageSizeKey?: string
  pageSize?: number
}

export interface Select2Props extends SelectProps {
  url?: string
  delay?: number
  searchKey?: string
  labelKey?: string | CallableFunction
  valueKey?: string | CallableFunction
  pagination?: true | false | SelectPagination
}

export default function Select2(props: Select2Props) {
  const [page, setPage] = useState<number>(1);
  const [keyword, setKeyword] = useState<string>('');
  const [options, setOptions] = useState<DefaultOptionType[]>(props.options || []);

  // 獲取數據
  const fetchData = useCallback((_keyword: string, _page: number = 1) => {
    if (!props.url) return;
    setOptions([]);
    const params: AnyObject = {};
    if (_keyword != '') params[props.searchKey || 'keyword'] = _keyword;
    if (props.pagination !== false) {
      const pagination = ((props.pagination === true) ? {} : props.pagination || {}) as SelectPagination;
      params[pagination.pageKey || 'page'] = _page;
      params[pagination.pageSizeKey || 'pageSize'] = pagination.pageSize || 10;
    }
    Api.get(props.url, {params: params}).then((response: AnyObject)=>{
      const data: DefaultOptionType[] = response.data.data?.map((item: DefaultOptionType)=>{
        return {
          label: typeof(props.labelKey) == 'string' ? item[props.labelKey] : (props.labelKey as CallableFunction)(item),
          value: typeof(props.valueKey) == 'string' ? item[props.valueKey] : (props.valueKey as CallableFunction)(item),
        };
      });
      setPage(_page);
      setOptions(data);
    });
  }, [props]);

  // 滾動加載更多
  const onPopupScroll = useCallback((e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const target = e.currentTarget;
    const clientHeight = target.clientHeight;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    if (clientHeight + scrollTop > scrollHeight - 20) {
      callDelay(() => {
        fetchData(keyword, page + 1);
      }, props.delay || 500);
    } else if (scrollTop == 0) {
      callDelay(() => {
        fetchData(keyword, Math.max(1, page - 1));
      }, props.delay || 500);
    }
  }, [props.delay, fetchData, keyword, page]);

  const select2Props = useMemo(()=>{
    const select2Props = Object.assign({}, props);
    if (select2Props.url != undefined) {
      select2Props.filterOption = false;
      select2Props.notFoundContent = <Spin size="small" />;
      select2Props.onSearch = (keyword: string)=>{
        callDelay(() => {
          setKeyword(keyword);
          fetchData(keyword);
        }, props.delay || 500);
      };
      select2Props.onFocus = () => {
        fetchData('');
      };
    }

    delete select2Props.url;
    delete select2Props.delay;
    delete select2Props.searchKey;
    delete select2Props.labelKey;
    delete select2Props.valueKey;
    delete select2Props.pagination;
    return select2Props;
  }, [fetchData, props]);

  select2Props.options = options;

  if (props.url != undefined && props.pagination !== false && props.onPopupScroll == undefined) {
    select2Props.onPopupScroll = onPopupScroll;
  }

  return (
    <Select {...select2Props} />
  );
}
