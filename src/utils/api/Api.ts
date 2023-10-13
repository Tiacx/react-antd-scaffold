import { message } from "antd";
import axios, { AxiosError, AxiosResponse } from "axios"
import authService from "@/services/Auth/AuthService";
import { dataGet } from "../functions";

// 請求攔截器
axios.interceptors.request.use((config) => {
  config.baseURL = import.meta.env.VITE_API_BASEURL;
  config.headers['Accept'] = 'application/json';
  config.headers['Authorization'] = getToken();
  return config;
});

// 響應攔截器
axios.interceptors.response.use(function (response) {
  return response;
}, function (error: AxiosError) {
  const status = dataGet(error, 'response.data.status', error.status);
  if (status == 401) {
    message.error('訪問令牌已失效，請重新登錄~');
    clearToken();
    location.href = '/auth/login';
  } else {
    const errmsg = dataGet(error, 'response.data.message', error.message) as string;
    message.error(errmsg);
  }
  return Promise.reject(error);
});

// 統一響應
export const apiResponse = (response: AxiosResponse, showErrorMessage = true) => {
    const data = response.data;
    if ([1, 200].includes(data.status) != undefined) {
        return data;
    }else if (showErrorMessage) {
      message.error(data.message);
    }
};

// 保存Token
export const setToken = (token: string, expiresIn: number) => {
  localStorage.setItem('token', token);
  localStorage.setItem('tokenExpiresIn', (new Date()).getTime() + expiresIn * 1000 + '');
};

// 獲取Token
export const getToken = () => {
  return localStorage.getItem('token') || '';
};

// 自動刷新Token
export const autoRefreshToken = () => {
  const token = getToken();
  const now = (new Date()).getTime();
  const tokenExpiresIn = parseInt(localStorage.getItem('tokenExpiresIn') || '0');
  if (token && now >= (tokenExpiresIn - 600000)) { // 有效期不足10分鐘
    authService.refresh().then(response => {
      if (response.status == 1) {
        setToken(response.data.token, response.data.expires_in);
      }
    });
  }
  setTimeout(autoRefreshToken, 480000); // 8分鐘刷新一次
};

// 清除Token
export const clearToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpiresIn');
  localStorage.removeItem('staff');
};

// 保存Staff
export const setStaff = (staff: object) => {
  return localStorage.setItem('staff', JSON.stringify(staff));
};

// 獲取Staff
export const getStff = () => {
  return JSON.parse(localStorage.getItem('staff') ?? '');
};

// 檢查是否已登錄
export const checkIsLogin = () => {
  const token = localStorage.getItem('token');
  if (token === null) {
    return false;
  } else {
    return (new Date()).getTime() < parseInt(localStorage.getItem('tokenExpiresIn') ?? '0');
  }
};

export const Api = axios;
export default Api;
