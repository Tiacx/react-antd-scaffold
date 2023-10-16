import { FormInstance } from "antd";
import { AnyObject } from "antd/es/_util/type";

class Model
{
  formInstance?: FormInstance

  load(data: AnyObject): void
  {
    Object.assign(this, data);
  }

  get(prop: string | undefined, defaultValue: unknown = undefined)
  {
    if (prop == undefined) return defaultValue;
    return Object.getOwnPropertyDescriptor(this, prop)?.value ?? defaultValue;
  }

  toObject(): AnyObject
  {
    const properties: {[key: string]: unknown} = {};
    for (const key in this) {
      if (typeof(this[key]) !== 'function' && key != 'formInstance') {
        properties[key] = this[key];
      }
    }
    return properties;
  }

  bindForm(formInstance: FormInstance): void
  {
    if (this.formInstance != undefined) return;

    this.formInstance = formInstance;
    Object.getOwnPropertyNames(this).forEach((prop: string)=>{
      Object.defineProperty(this, prop, {
        configurable: true,
        get: () => {
          return formInstance.getFieldValue(prop);
        },
        set: (value) => {
          formInstance.setFieldValue(prop, value);
        }
      });
    });
  }

  clearForm(): void
  {
    this.formInstance?.resetFields();
  }
}

export default Model;
