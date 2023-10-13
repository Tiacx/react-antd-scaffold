import { Breadcrumb, Button, Modal } from "antd"
import { GridViewCols, GridView } from "@/components/table/GridView";
import ApiDataProvider from "@/utils/api/ApiDataProvider";
import { AnyObject } from "antd/es/_util/type";
import questionService from "@/services/Admin/QuestionService";
import CollapseContent from "@/components/table/CollapseContent";
import EditQuestion from "./edit";
import { useMemo, useState } from "react";
import QuestionStatus from "@/enums/QuestionStatus";
import "@/assets/styles/table.css"

export default function QuestionList() {
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [questionId, setQuestionId] = useState<string>('');

  const [columns, dataProvider] = useMemo(()=>{
    const columns: GridViewCols = {
      qid: 'QID|sorter|filter',
      title: {
        title: '問題標題',
        align: 'left',
        sorter: true,
        noWrap: false,
        filter: true,
      },
      answer: {
        title: '問題答案',
        align: 'left',
        sorter: true,
        filter: true,
        noWrap: false,
        render: (answer: string) => <CollapseContent width="350px" content={answer} />
      },
      created_by: '上傳者|sorter|filter',
      categories: {
        title: '分類',
        filter: true,
        render: (text: AnyObject[]) => text.map(item => item.name).join('、')
      },
      departments: {
        title: '所屬部門',
        filter: true,
        render: (text: AnyObject[]) => text.map(item => item.name).join('、')
      },
      created_at: {
        title: '首次上傳時間',
        sorter: true,
      },
      updated_at: {
        title: '最後修改時間',
        sorter: true,
      },
      status: {
        title: '狀態',
        sorter: true,
        filter: true,
        options: Object.values(QuestionStatus),
      },
      actions: {
        title: '操作',
        render: (_, record) => <Button type="default" onClick={()=>{
          setQuestionId(record.id);
          setShowEditModal(true);
        }}>編輯</Button>
      },
    };

    const dataProvider = new ApiDataProvider({
      service: questionService,
      method: 'getList',
      params: {
        'with_answer': 1,
      }
    });

    return [columns, dataProvider];
  }, []);

  return (
    <>
      <Breadcrumb className="mb-2" items={[
        {title: 'admin'},
        {title: 'question'}
      ]} />
      <GridView
        cols={columns}
        dataProvider={dataProvider}
        align="center"
        rowSelection={{type: 'checkbox'}}
        noWrap={true}
      />
      <Modal
        title="編輯問題"
        footer={false}
        width={900}
        open={showEditModal}
        onCancel={()=>setShowEditModal(false)}
      >
        <EditQuestion
          id={questionId}
          onCancel={()=>setShowEditModal(false)}
          onFinish={()=>{
            setShowEditModal(false);
            dataProvider.refresh();
          }}
        />
      </Modal>
    </>
  );
}
