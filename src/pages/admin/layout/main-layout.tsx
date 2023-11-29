import { useState, useEffect } from "react"
import { Dropdown, Layout, Menu, MenuProps, Space } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import * as api from "@/utils/api/Api"
import authService from "@/services/Auth/AuthService"
import Sider from "antd/es/layout/Sider"
import { Link, Outlet, useNavigate } from "react-router-dom"

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
      key: 'frontend',
      label: <Link to='/'>前臺管理</Link>,
    },
    {
      key: 'logout',
      label: '退出登錄',
      onClick: () => {
        authService.logout().then((response) => {
          if (response.status == 1) {
            api.clearToken();
            location.href = '/auth/login';
          }
        });
      }
    }
  ];

  return (
    <Layout className="w-full min-h-screen">
      <Header className="flex justify-between bg-blue-500 px-6">
        <Space className="text-white text-lg">FAQ後臺管理系統</Space>
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
        <Sider className="w-50">
          <Menu
            mode="inline"
            defaultSelectedKeys={[location.pathname]}
            defaultOpenKeys={['content']}
            style={{ height: '100%', borderRight: 0 }}
            theme="dark"
            items={[
              {
                key: 'content',
                label: '內容管理',
                children: [
                  {
                    key: '/admin/question',
                    label: <Link to='/admin/question'>問題管理</Link>,
                  },
                  {
                    key: '/admin/category',
                    label: <Link to='/admin/category'>分類管理</Link>,
                  },
                  {
                    key: '/admin/tag',
                    label: <Link to='/admin/tag'>標籤管理</Link>,
                  }
                ],
              },
              {
                key: '/admin/role',
                label: <Link to='/admin/role'>角色管理</Link>,
              }
            ]}
          />
        </Sider>

        <Layout>
          <Content className="p-3">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
