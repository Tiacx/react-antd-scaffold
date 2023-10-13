import { Rule } from "antd/es/form";

interface ModelRules
{
  rules(): {[key: string]: Rule[]}
  labels(): {[key: string]: string}
}

export default ModelRules;
