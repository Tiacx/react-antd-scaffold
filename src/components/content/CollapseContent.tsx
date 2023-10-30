import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Space, Tooltip } from "antd";
import { useState } from "react";

export interface CollapseContentProps {
  content: string
  width?: string,
  className?: string
  openName?: string
  closeName?: string
}

export default function CollapseContent(props: CollapseContentProps) {
  const [showContent, setShowContent] = useState<boolean>(false);
  const openName = props.openName || '展開';
  const closeName = props.closeName || '關閉';
  const className = (props.className || 'w-80 h-20') + (showContent ? ' h-auto' : ' overflow-hidden');
  const icon = showContent ? <DownOutlined onClick={()=>{setShowContent(false)}} /> : <UpOutlined onClick={()=>{setShowContent(true)}} />;

  return <Space>
    <div className={className} style={{width: props.width}} dangerouslySetInnerHTML={{__html: props.content}}></div>
    <Tooltip title={showContent ? closeName : openName}>{icon}</Tooltip>
  </Space>;
}
