import * as api from "@/utils/api/Api";
import authService from "@/services/Auth/AuthService"
import DetailView, { DetailViewAttribute } from "@/components/form/DetailView";
import LoginForm from "@/models/auth/LoginForm";
import { Button, InputProps, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";

export default function Login() {
  const navigate = useNavigate();

  const [model, attributes, onFinish] = useMemo(()=>{
    const model = new LoginForm();
    const attributes: Array<DetailViewAttribute> = [
      {
        name: 'username',
        componentProps: {
          placeholder: 'UserName',
          size: 'large',
        } as InputProps,
      },
      {
        name: 'password',
        componentProps: {
          type: 'password',
          placeholder: 'Password',
          size: 'large',
        } as InputProps,
        className: 'mb-8',
      },
    ];
    const onFinish = async (values: LoginForm) => {
      const response = await authService.login(values);
      if (response.status == 1) {
        api.setToken(response.data.token, response.data.expires_in);
        api.setStaff(response.data.staff);
        navigate('/admin/question');
      } else {
        message.error(response.message);
      }
    };
    return [model, attributes, onFinish];
  }, [navigate]);

  useEffect(()=>{
    if (api.checkIsLogin()) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-blue-100">
      <div className="bg-white rounded-md shadow-2xl p-5">
        <h1 className="text-gray-800 font-bold text-2xl mb-1">Login</h1>
        <p className="text-sm text-gray-600 mb-5">FAQ</p>
        <DetailView
          model={model}
          className='w-96'
          onFinish={onFinish}
          attributes={attributes}
          buttons={[
            <Button type="primary" htmlType="submit" size="large" key="1" block>Login</Button>,
          ]}
        />
      </div>
    </div>
  );
}
