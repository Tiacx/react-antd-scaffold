import {Api, apiResponse} from "@/utils/api/Api"
import BaseService from "../BaseService";

class TagService extends BaseService
{
  key: string = 'id'

  getList = async (params: object) => {
    const response = await Api.get('/api/admin/group/tags', {
        'params': params
    })
    return apiResponse(response);
  }

  dropdown = async (params: object) => {
    const response = await Api.get('/api/admin/group/tags/dropdown', {
        'params': params
    })
    return apiResponse(response);
  }
}

const tagService = new TagService();
export default tagService;
