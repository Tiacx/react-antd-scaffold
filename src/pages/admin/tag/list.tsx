import { Breadcrumb } from "antd"
import { GridView } from "@/components/table/GridView";
import ApiDataProvider from "@/utils/api/ApiDataProvider";
import { AnyObject } from "antd/es/_util/type";
import tagService from "@/services/Admin/TagService";
import { useMemo } from "react";

export default function CategoryList() {
  const dataProvider = useMemo(()=>{
    return new ApiDataProvider({
      service: tagService,
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
        {title: 'role'}
      ]} />
      <GridView
        cols={{
          name: '標題名稱',
          description: '標籤描述',
          departments: {
            title: '所屬部門',
            render: (text) => text.map((item: AnyObject) => item.name).join('、')
          }
        }}
        dataProvider={dataProvider}
      />
    </>
  );
}
