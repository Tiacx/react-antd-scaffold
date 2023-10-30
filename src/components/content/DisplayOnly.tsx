import { recursiveMap } from "@/utils/functions";
import { AnyObject } from "antd/es/_util/type";
import { ReactNode, useMemo } from "react";

export interface DisplayOnlyProps {
  value?: string
  children?: ReactNode
  componentProps?: AnyObject
}

export default function DisplayOnly(props: DisplayOnlyProps) {
  const content = useMemo(() => {
    let content;
    if (typeof(props.value) == 'string') {
      const value = props.value.trim();
      if (value.startsWith('<')) { // 富文本
        content = <div dangerouslySetInnerHTML={{__html: props.value}} />;
      } else if (props.componentProps?.options) { // Select（單選）或 Radio
        content = props.componentProps.options.find(value).label;
      } else if (props.componentProps?.treeData) { // TreeSelect（單選）
        content = recursiveMap(props.componentProps.treeData, (item: AnyObject) => {
          return item.value == value ? item.title : false;
        }).join('、');
      } else {
        content = value;
      }
    } else if (props.componentProps != undefined) {
      const values = typeof(props.value) == 'object' ? (props.value as AnyObject) : [props.value];
      if (props.componentProps?.options) { // Select（多選）或 CheckBox 或 Radio
        content = props.componentProps.options.filter((item: AnyObject) => {
          return values.includes(item.value);
        }).map((item: AnyObject) => item.label).join('、');
      } else if (props.componentProps?.treeData) { // TreeSelect（多選）
        content = recursiveMap(props.componentProps.treeData, (item: AnyObject) => {
          return values.includes(item.value) ? item.title : false;
        }).join('、');
      } else if (values[0]?.label !== undefined) {
        content = values.map((item: AnyObject) => item.label).join('、');
      }
    }

    return content;
  }, [props.componentProps, props.value]);

  return (
    <span>
      {content}
      {props.children}
    </span>
  );
}
