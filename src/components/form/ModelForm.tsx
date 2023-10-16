import * as Antd from "antd"
import Model from "@/models/base/Model";
import { Form } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { callDelay, removeUndefined } from "@/utils/functions";
import { v4 as uuidv4 } from "uuid"
import { FunctionComponent, ReactElement, ReactNode, useMemo } from "react";
import ModelRules from "@/models/base/ModelRules";
import DisplayOnly from "./DisplayOnly";

export interface ModelFormProps extends Antd.FormProps {
  model?: Model & ModelRules
  mode?: 'edit' | 'view'
  attributes?: Array<ModelFormAttribute>
  buttons?: Array<ReactElement>
  buttonsWrapperProps?: Antd.FormItemProps
  loading?: boolean
}

export interface ModelFormAttribute extends Antd.FormItemProps {
  component?: AnyObject
  componentProps?: AnyObject
  itemsSpaceProps?: Antd.SpaceProps
  displayOnly?: boolean
  displayValue?: string | ReactNode
  columns?: Array<ModelFormColumn>
}

interface ModelFormColumn extends Antd.FormItemProps {
  component?: AnyObject
  componentProps?: AnyObject
  displayOnly?: boolean
  displayValue?: string | ReactNode
}

export default function ModelForm(props: ModelFormProps) {
  // 表單
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const form = props.form || Form.useForm()[0];
  // 表單項及配置
  const [formItems, formProps] = useMemo(()=>{
    // 處理表單項
    const formItems = props.attributes?.map(attr=>{
      const columns = attr.columns ?? [attr];
      const elements = columns.map(itemProps => {
        itemProps.rules = props.model?.rules()[itemProps.name] ?? undefined; // 驗證規則
        itemProps.messageVariables = {name: props.model?.labels()[itemProps.name] ?? itemProps.name};

        let content;
        const componentProps = itemProps.componentProps || {};
        if (props.mode == 'view' || itemProps.displayOnly === true) { // 只讀
          if (itemProps.displayValue !== undefined) {
            content = itemProps.displayValue;
          } else {
            content = <DisplayOnly componentProps={componentProps}/>
          }
        } else {
          const Component = (itemProps.component || Antd.Input) as FunctionComponent; // 動態創建組件
          if (Component.displayName == 'TreeSelect') {
            // 解決異步加載時：[Tree missing follow keys] warning
            if (componentProps.treeData == undefined || componentProps.treeData.length == 0) {
              let values = props.model?.toObject()[itemProps.name] || [];
              if (typeof(values) == 'string') values = [values];
              componentProps.treeData = values.map((v: string) => {
                return {title: v, value: v};
              });
            }
          }
          content = <Component {...componentProps}/>;
        }

        const formItemProps = removeUndefined({...itemProps} as AnyObject);
        delete formItemProps.component;
        delete formItemProps.componentProps;
        delete formItemProps.itemsSpaceProps;
        delete formItemProps.columns;
        delete formItemProps.displayOnly;
        delete formItemProps.displayValue;

        return (
          <Form.Item {...formItemProps} key={uuidv4()}>
            {content}
          </Form.Item>
        );
      });

      if (elements.length > 1) { // 多個控件
        const itemsSpaceProps = removeUndefined(attr.itemsSpaceProps || {});
        return (
          <Antd.Space {...itemsSpaceProps} key={uuidv4()}>
            {elements}
          </Antd.Space>
        );
      } else {
        return elements;
      }
    });

    // 操作按鈕
    if (props.buttons !== undefined) {
      const buttons = props.buttons.length == 1 ? props.buttons : <Antd.Space>{props.buttons}</Antd.Space>
      formItems?.push([
        <Form.Item {...props.buttonsWrapperProps} key={uuidv4()}>
          {buttons}
        </Form.Item>
      ]);
    }

    const formProps = removeUndefined({...props} as AnyObject);
    formProps.initialValues = props.model?.toObject();
    delete formProps.model;
    delete formProps.mode;
    delete formProps.attributes;
    delete formProps.submitButton;
    delete formProps.buttonsWrapperProps;
    delete formProps.buttons;
    delete formProps.buttonsWrapperProps;
    delete formProps.loading;

    return [formItems, formProps];
  }, [props]);

  // 綁定 Form
  formProps.form = form;
  callDelay(() => {
    props.model?.bindForm(form);
  }, 500);

  return (
    <Antd.Spin spinning={props.loading || false}>
      <Form {...formProps}>
        {formItems}
      </Form>
    </Antd.Spin>
  );
}
