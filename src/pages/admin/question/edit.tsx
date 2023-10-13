import { useEffect, useMemo, useState } from "react";
import DetailView, { DetailViewAttribute } from "@/components/form/DetailView";
import EditQuestionForm from "@/models/question/EditQuestion";
import { Button, Radio, RadioGroupProps, TreeSelect, TreeSelectProps } from "antd";
import questionService from "@/services/Admin/QuestionService";
import TextArea from "antd/es/input/TextArea";
import categoryService from "@/services/Admin/CategoryService";
import { AnyObject } from "antd/es/_util/type";
import unitService from "@/services/Admin/UnitService";
import Select2, { Select2Props } from "@/components/form/Select2";
import tagService from "@/services/Admin/TagService";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

interface EditQuestionProps {
  id: string
  onCancel: () => void
  onFinish: (response: AnyObject) => void
}

const model = new EditQuestionForm();

export default function EditQuestion(props: EditQuestionProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [allCategories, setAllCategories] = useState<AnyObject[]>([]);
  const [allDepartments, setAllDepartments] = useState<AnyObject[]>([]);
  const [allTags, setAllTags] = useState<AnyObject[]>([]);

  const [attributes, onFinish, onCancel] = useMemo(()=>{
    const attributes: Array<DetailViewAttribute> = [
      {
        label: 'ID',
        name: 'id',
        hidden: true,
      },
      {
        label: '問題標題',
        name: 'title',
        component: TextArea,
      },
      {
        label: '問答答案',
        name: 'answer',
        component: ReactQuill,
        componentProps: {
          className: 'h-40 mb-9',
        } as ReactQuill.ReactQuillProps,
      },
      {
        label: '所屬分類',
        name: 'categories',
        component: TreeSelect,
        componentProps: {
          treeData: allCategories,
          treeCheckable: true,
          showCheckedStrategy: "SHOW_PARENT",
          allowClear: true,
        } as TreeSelectProps,
      },
      {
        label: '所屬部門',
        name: 'departments',
        component: TreeSelect,
        componentProps: {
          treeData: allDepartments,
          showCheckedStrategy: "SHOW_PARENT",
          allowClear: true,
        } as TreeSelectProps,
      },
      {
        label: '可見範圍（人）',
        name: 'staff_scopes',
        component: Select2,
        componentProps: {
          url: '/api/admin/staff',
          mode: 'multiple',
          placeholder: '輸入關鍵字搜索...',
          allowClear: true,
          labelInValue: true,
          labelKey: (item: AnyObject) => `${item.user_name}（${item.department_name}）`,
          valueKey: 'id',
        } as Select2Props,
      },
      {
        label: '可見範圍（架構）',
        name: 'unit_scopes',
        component: TreeSelect,
        componentProps: {
          treeData: allDepartments,
          treeCheckable: true,
          showCheckedStrategy: "SHOW_PARENT",
          allowClear: true,
        } as TreeSelectProps,
      },
      {
        label: '可見範圍（標籤）',
        name: 'tag_scopes',
        component: Select2,
        componentProps: {
          mode: 'multiple',
          options: allTags,
          showSearch: true,
          allowClear: true,
        } as Select2Props,
      },
      {
        label: '狀態',
        name: 'status',
        component: Radio.Group,
        componentProps: {
          options: [
            {label: '啟用', value: 1},
            {label: '停用', value: 0},
          ],
        } as RadioGroupProps
      }
    ];

    const onFinish = async (values: EditQuestionForm) => {
      if (values.staff_scopes) {
        values.staff_scopes = values.staff_scopes.map(item=>item.value);
      }
      values.departments = [values.departments as string];
      const response = await questionService.update(values.id as string, values);
      if (response.status == 1) {
        props.onFinish(response);
      }
    };

    const onCancel = ()=>{
      model.clearForm();
      props.onCancel();
    };
    return [attributes, onFinish, onCancel];
  }, [allCategories, allDepartments, allTags, props]);

  useEffect(()=>{
    // 分类树
    categoryService.all({return_tree: 1}).then((response)=>{
      setAllCategories(response.data || {});
    });
    // 部門樹
    unitService.all({type: 4, return_tree: 1}).then((response)=>{
      setAllDepartments(response.data || {});
    });
    // 標籤列表
    tagService.dropdown({type: 4, return_tree: 1}).then((response)=>{
      setAllTags(response.data.map((item: AnyObject)=>{
        return {label: item.name, value: item.id}
      }));
    });
  }, []);

  useEffect(()=>{
    // 問題詳情
    setLoading(true);
    questionService.get(props.id).then((response)=>{
      if (response.data) {
        if (response.data.departments) {
          response.data.departments = response.data.departments[0].id;
        }
        if (response.data.staff_scopes) {
          response.data.staff_scopes = response.data.staff_scopes.map((item: AnyObject)=>{
            return {label: `${item.user_name}（${item.department_name}）`, value: item.id};
          });
        }
      }
      model.load(response.data || {});
      setLoading(false);
    })
  }, [props.id]);

  return (
    <DetailView
      model={model}
      attributes={attributes}
      className="mt-7"
      onFinish={onFinish}
      loading={loading}
      labelCol={{span: 4}}
      buttons={[
        <Button type="primary" htmlType="submit" key="1">保存</Button>,
        <Button type="default" key="2" onClick={onCancel}>取消</Button>,
      ]}
      buttonsWrapperProps={{
        className: 'text-right mt-10',
      }}
    />
  );
}
