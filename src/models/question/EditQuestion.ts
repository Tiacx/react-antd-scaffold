import { FormRule } from "antd";
import Model from "@/models/base/Model";
import ModelRules from "@/models/base/ModelRules";
import { AnyObject } from "antd/es/_util/type";

class EditQuestionForm extends Model implements ModelRules
{
  id?: string
  title?: string
  answer?: string
  categories?: string[]
  departments?: string[] | string
  staff_scopes?: Array<AnyObject>
  unit_scopes?: string[]
  tag_scopes?: string[]
  status?: 1 | 0

  rules(): { [key: string]: FormRule[] }
  {
    return {
      id: [{ required: true}],
      title: [{ required: true}],
      answer: [{ required: true}],
      categories: [{ required: true}],
      departments: [{ required: true}],
      status: [{ required: true}],
    };
  }

  labels(): { [key: string]: string }
  {
    return {
      id: '主鍵ID',
      title: '問題標籤',
      answer: '問題答案',
      categories: '所屬分類',
      departments: '所屬部門',
      staff_scopes: '可見範圍（人）',
      unit_scopes: '可見範圍（架構）',
      tag_scopes: '可見範圍（標籤）',
      status: '狀態',
    };
  }

}

export default EditQuestionForm;
