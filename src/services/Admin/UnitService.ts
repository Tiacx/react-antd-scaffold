import {Api, apiResponse} from "@/utils/api/Api"
import BaseService from "../BaseService";

class UnitService extends BaseService
{
  key: string = 'id'

  all = async (params: object) => {
    const response = await Api.get('/api/admin/unit/all', {
        'params': params
    })
    return apiResponse(response);
  }
}

const unitService = new UnitService();
export default unitService;
