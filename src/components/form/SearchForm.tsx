import { useMemo } from "react";
import ModelForm, { ModelFormAttribute, ModelFormProps } from "./ModelForm";
import { Button } from "antd";

export interface SearchFormProps extends ModelFormProps {
  items?: {[key: string]: string | ModelFormAttribute}
}

export default function SearchForm(props: SearchFormProps) {
  const formProps = useMemo(() => {
    const formProps = Object.assign({}, props);
    formProps.layout = formProps.layout || 'inline';

    if (Array.isArray(formProps.items)) {
      formProps.attributes = formProps.items;
    } else {
      formProps.attributes = [];
      for (const [k, v] of Object.entries(formProps.items || {})) {
        if (typeof(v) == 'string') {
          formProps.attributes.push({label: v as string, name: k});
        } else {
          formProps.attributes.push(Object.assign({name: k}, v));
        }
      }
    }

    if (formProps.buttons == undefined) {
      formProps.buttons = [
        <Button type="primary" htmlType="submit" key="1">搜索</Button>,
        <Button type="default" htmlType="reset" key="2">重置</Button>,
      ];
    }

    delete formProps.items;
    return formProps;
  }, [props]);

  return (
    <ModelForm {...formProps} />
  );
}
