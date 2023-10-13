import { FormRule } from "antd";
import Model from "@/models/base/Model";
import ModelRules from "@/models/base/ModelRules";

class LoginForm extends Model implements ModelRules
{
  username?: string
  password?: string

  rules(): { [key: string]: FormRule[] }
  {
    return {
      username: [{ required: true}],
      password: [{ required: true}],
    };
  }

  labels(): { [key: string]: string }
  {
    return {
      username: '賬號',
      password: '密碼',
    };
  }

}

export default LoginForm;
