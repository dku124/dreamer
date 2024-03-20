import {notiSelector} from "@/common/store/noti/noti.slice";
import {Label} from "@/components/label/Label";
import {Form, Input} from "antd";
import {useForm} from "antd/es/form/Form";
import {useSelector} from "react-redux";
import "./index.scss"
import {Category} from "@/@types/repo/category.type";
import {useEffect} from "react";

export function CateCreateModalNoti() {
  const noti = useSelector(notiSelector);
  const [form] = useForm();


  useEffect(() => {
    if (noti.select) {
        const data = noti.select?.data[0] as Category;
        form.setFieldsValue({
            name: data.name,
        });
    }
  }, [noti.select])

  return (
    <div>
        <Form form={form}>
            <Form.Item
                label={<Label minWidth={110} text={"Tên danh mục"} />} name={"name"}>
                <Input disabled />
            </Form.Item>
        </Form>
    </div>
  );
}
