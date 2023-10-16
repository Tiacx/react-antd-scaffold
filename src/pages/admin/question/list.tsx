import { Breadcrumb, Button, Form, Modal, TreeSelect, TreeSelectProps } from "antd"
import { GridViewCols, GridView } from "@/components/table/GridView";
import ApiDataProvider from "@/utils/api/ApiDataProvider";
import { AnyObject } from "antd/es/_util/type";
import questionService from "@/services/Admin/QuestionService";
import CollapseContent from "@/components/table/CollapseContent";
import EditQuestion from "./edit";
import { useCallback, useEffect, useMemo, useState } from "react";
import QuestionStatus from "@/enums/QuestionStatus";
import "@/assets/styles/table.css"
import SearchForm from "@/components/form/SearchForm";
import categoryService from "@/services/Admin/CategoryService";

export default function QuestionList() {
  const [form] = Form.useForm();
  const [allCategories, setAllCategories] = useState<AnyObject[]>([]);
  const [params, setParams] = useState<AnyObject>({with_answer: 1});
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [questionId, setQuestionId] = useState<string>('');

  const columns = useMemo(()=>{
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
        filter: true,
        filterType: 'date',
      },
      updated_at: {
        title: '最後修改時間',
        sorter: true,
        filter: true,
        filterType: 'date',
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
    return columns;
  }, []);

  const dataProvider = useMemo(() => {
    return new ApiDataProvider({
      service: questionService,
      method: 'getList',
      params: params
    });
  }, [params]);

  useEffect(() => {
    // 分类树
    categoryService.all({return_tree: 1}).then((response)=>{
      setAllCategories(response.data || []);
    });
  }, []);

  const onSelectCategory = useCallback((_value: string, node: AnyObject) => {
    form.setFieldValue('categories', node.title);
  }, [form]);

  const onSearch = useCallback((values: AnyObject) => {
    setParams({
      with_answer: 1,
      filters: values,
    });
  }, []);

  const onReset = useCallback(() => {
    form.resetFields();
    setParams({with_answer: 1});
  }, [form]);

  return (
    <>
      <Breadcrumb className="mb-2" items={[
        {title: 'admin'},
        {title: 'question'}
      ]} />
      <div className="bg-white">
        <SearchForm
          className="p-2"
          form={form}
          items={{
            'categories': {
              label: '分類',
              component: TreeSelect,
              componentProps: {
                treeData: allCategories,
                showSearch: true,
                allowClear: true,
                treeNodeFilterProp: 'title',
                onSelect: onSelectCategory,
              } as TreeSelectProps,
              wrapperCol: {className: 'w-60'}
            },
            'title': '標題',
          }}
          onFinish={onSearch}
          onReset={onReset}
        />
        <GridView
          cols={columns}
          dataProvider={dataProvider}
          align="center"
          rowSelection={{type: 'checkbox'}}
          noWrap={true}
        />
      </div>
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
