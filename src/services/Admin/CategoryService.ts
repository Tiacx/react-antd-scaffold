import Api, { apiResponse } from "@/utils/api/Api";
import BaseService from "../BaseService";

class CategoryService extends BaseService
{
  key: string = 'id'

  getList = async (params: object) => {
    const response = await Api.get('/api/admin/category', {
        'params': params
    })
    return apiResponse(response);
  }

  all = async (params: object) => {
    const response = await Api.get('/api/admin/category/all', {
        'params': params
    })
    return apiResponse(response);
  }
}

const categoryService = new CategoryService();
export default categoryService;
