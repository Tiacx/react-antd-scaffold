import { Breadcrumb } from "antd"
import { GridView } from "@/components/table/GridView";
import categoryService from "@/services/Admin/CategoryService";
import ApiDataProvider from "@/utils/api/ApiDataProvider";
import { useMemo } from "react";

export default function CategoryList() {
  const dataProvider = useMemo(()=>{
    return new ApiDataProvider({
      service: categoryService,
      method: 'getList',
      params: {
        'per_page': 10
      }
    });
  }, []);

  return (
    <>
      <Breadcrumb className="mb-2" items={[
        {title: 'admin'},
        {title: 'category'}
      ]} />
      <GridView
        cols={{
          name: '分類名稱',
          description: '分類描述',
        }}
        dataProvider={dataProvider}
      />
    </>
  );
}
