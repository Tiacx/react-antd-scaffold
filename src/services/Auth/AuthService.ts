import {Api, apiResponse} from "@/utils/api/Api"
import LoginForm from "@/models/auth/LoginForm";
import BaseService from "../BaseService";

class AuthService extends BaseService
{
  key: string = 'id'

  login = async (model: LoginForm) => {
    const response = await Api.post('/api/auth/login', {
        'username': model.username,
        'password': model.password
    })
    return apiResponse(response);
  }

  refresh = async () => {
    const response = await Api.post('/api/auth/refresh')
    return apiResponse(response);
  }

  logout = async () => {
    const response = await Api.post('/api/auth/logout')
    return apiResponse(response);
  }
}

const authService = new AuthService();
export default authService;
