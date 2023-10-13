import * as Antd from "antd"
import Model from "@/models/base/Model";
import { Form } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { removeUndefined } from "@/utils/functions";
import { v4 as uuidv4 } from "uuid"
import { FunctionComponent, HTMLAttributes, ReactElement, useMemo } from "react";
import ModelRules from "@/models/base/ModelRules";

interface DetailViewProps extends Antd.FormProps {
  model: Model & ModelRules
  mode?: 'edit' | 'view'
  attributes: Array<DetailViewAttribute>
  buttons?: Array<ReactElement>
  buttonsWrapperProps?: Antd.FormItemProps
  loading?: boolean
}

export interface DetailViewAttribute extends Antd.FormItemProps {
  component?: AnyObject
  componentProps?: AnyObject
  rowOptions?: HTMLAttributes<HTMLDivElement>
  displayOnly?: boolean
  columns?: Array<DetailViewColumn>
}

interface DetailViewColumn extends Antd.FormItemProps {
  component?: AnyObject
  componentProps?: AnyObject
  displayOnly?: boolean
}

export default function DetailView(props: DetailViewProps) {
  // 表單
  const form = Form.useForm()[0];
  // 表單項及配置
  const [formItems, formPropps] = useMemo(()=>{
    // 處理表單項
    const formItems = props.attributes.map(attr=>{
      const columns = attr.columns ?? [attr];
      const elements = columns.map(itemProps => {
        itemProps.rules = props.model.rules()[itemProps.name] ?? undefined; // 驗證規則
        itemProps.messageVariables = {name: props.model.labels()[itemProps.name] ?? itemProps.name};

        let content;
        const options = itemProps.componentProps || {};
        if (props.mode == 'view' || itemProps.displayOnly === true) { // 只讀
          options.type = 'hidden';
          content = (
            <span>
              <Antd.Input {...options} />
              {props.model.get(itemProps.name, '')}
            </span>
          )
        } else { // 可編輯
          const Component = (itemProps.component || Antd.Input) as FunctionComponent; // 動態創建組件
          content = <Component {...options}/>;
        }

        const formItemProps = removeUndefined({...itemProps} as AnyObject);
        delete formItemProps.component;
        delete formItemProps.componentProps;
        delete formItemProps.rowOptions;
        delete formItemProps.columns;
        delete formItemProps.displayOnly;

        return (
          <Form.Item {...formItemProps} key={uuidv4()}>
            {content}
          </Form.Item>
        );
      });

      if (elements.length > 1) { // 多個控件
        const rowOptions = removeUndefined(attr.rowOptions || {});
        return (
          <Antd.Space.Compact {...rowOptions} key={uuidv4()}>
            {elements}
          </Antd.Space.Compact>
        );
      } else {
        return elements;
      }
    });

    // 操作按鈕
    if (props.buttons !== undefined) {
      const buttons = props.buttons.length == 1 ? props.buttons : <Antd.Space>{props.buttons}</Antd.Space>
      formItems.push([
        <Form.Item {...props.buttonsWrapperProps} key={uuidv4()}>
          {buttons}
        </Form.Item>
      ]);
    }

    const formPropps = removeUndefined({...props} as AnyObject);
    formPropps.initialValues = props.model.toObject();
    formPropps.form = form;
    delete formPropps.model;
    delete formPropps.mode;
    delete formPropps.attributes;
    delete formPropps.submitButton;
    delete formPropps.buttonsWrapperProps;
    delete formPropps.buttons;
    delete formPropps.buttonsWrapperProps;
    delete formPropps.loading;

    return [formItems, formPropps];
  }, [form, props]);

  // Model 綁定 Form
  props.model.bindForm(form);

  return (
    <Antd.Spin spinning={props.loading || false}>
      <Form {...formPropps}>
        {formItems}
      </Form>
    </Antd.Spin>
  );
}
