import {Api, apiResponse} from "@/utils/api/Api"
import BaseService from "../BaseService";

class StaffService extends BaseService
{
  key: string = 'id'

  getList = async (params: object) => {
    const response = await Api.get('/api/admin/staff', {
        'params': params
    })
    return apiResponse(response);
  }
}

const staffService = new StaffService();
export default staffService;
