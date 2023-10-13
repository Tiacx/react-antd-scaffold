import EditQuestionForm from "@/models/question/EditQuestion";
import {Api, apiResponse} from "@/utils/api/Api"
import BaseService from "../BaseService";

class QuestionService extends BaseService
{
  key: string = 'id'

  getList = async (params: object) => {
    const response = await Api.get('/api/admin/question', {
        'params': params
    })
    return apiResponse(response);
  }

  get = async (id: string) => {
    const response = await Api.get('/api/admin/question/' + id);
    return apiResponse(response);
  }

  update = async (id: string, data: EditQuestionForm) => {
    const response = await Api.put('/api/admin/question/' + id, data);
    return apiResponse(response);
  }
}

const questionService = new QuestionService();
export default questionService;
