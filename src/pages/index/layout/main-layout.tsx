import { useState, useEffect } from "react"
import { Dropdown, Layout, MenuProps, Space } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import * as api from "@/utils/api/Api"
import authService from "@/services/Auth/AuthService"
import { Outlet, useNavigate } from "react-router-dom"

const {Header, Content} = Layout;

interface StaffModel {
  id: string,
  user_name: string
}

export default function MainLayout() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState<StaffModel>();

  useEffect(() => {
    if (!api.checkIsLogin()) {
      navigate('/auth/login');
    }
    setStaff(api.getStff());
  }, [navigate]);

  const items: MenuProps['items'] = [
    {
      key: 'backend',
      label: '後臺管理',
      onClick: () => {
        navigate('/admin/question');
      }
    },
    {
      key: 'logout',
      label: '退出登錄',
      onClick: () => {
        authService.logout().then((response) => {
          if (response.status == 1) {
            api.clearToken();
            navigate('/auth/login');
          }
        });
      }
    }
  ];

  return (
    <Layout className="w-full min-h-screen">
      <Header className="flex justify-between bg-blue-500 px-6">
        <Space className="text-white text-lg">FAQ</Space>
        <Dropdown menu={{ items }}>
          <Space className="text-white">
            <div className="flex justify-center items-center w-8 h-8 rounded-full border border-solid border-white">
              <div className="flex justify-center items-center w-6 h-6 rounded-full bg-white text-center text-blue-500 font-bold">
                { staff?.user_name.substring(0, 1).toUpperCase() }
              </div>
            </div>
            { staff?.user_name.toUpperCase() }
            <DownOutlined />
          </Space>
        </Dropdown>
      </Header>

      <Layout>
        <Content className="p-3">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
