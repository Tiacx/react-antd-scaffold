import {Api, apiResponse} from "@/utils/api/Api"
import BaseService from "../BaseService";

class RoleService extends BaseService
{
  key: string = 'id'

  getList = async (params: object) => {
    const response = await Api.get('/api/admin/role', {
        'params': params
    })
    return apiResponse(response);
  }
}

const roleService = new RoleService();
export default roleService;
