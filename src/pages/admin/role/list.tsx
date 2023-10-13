import { Breadcrumb } from "antd"
import { GridView } from "@/components/table/GridView";
import ApiDataProvider from "@/utils/api/ApiDataProvider";
import roleService from "@/services/Admin/RoleService";
import { useMemo } from "react";

export default function CategoryList() {
  const dataProvider = useMemo(()=>{
    return new ApiDataProvider({
      service: roleService,
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
          name: '角色名',
          description: '角色描述',
        }}
        dataProvider={dataProvider}
      />
    </>
  );
}
