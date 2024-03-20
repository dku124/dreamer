import {Form, Input, Modal, ModalProps} from "antd";
import {useForm} from "antd/es/form/Form";
import {Label} from "@components/label/Label.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@store/store.ts";
import {useEffect} from "react";
import CategoryThunk from "@store/category/category.thunk.ts";
import {Category} from "@/@types/repo/category.type.ts";
import {categorySelector} from "@store/category/category.slice.ts";

export default function CategoryUpdateModal(props: ModalProps) {
	const [form] = useForm()
	const dispatch = useDispatch<AppDispatch>()
	const category = useSelector(categorySelector)
	const onFinish = (values: Partial<Category>) => {
		dispatch(CategoryThunk.update({
			...category.select,
			...values
		}))
		if (props.onCancel) {
			props.onCancel(undefined as any)
		}
	}
	useEffect(() => {
		form.resetFields()
		if (category.select) {
			form.setFieldsValue(category.select)
		}
	}, [props.open])


	return(
		<div id="ProductUnitCreateModal">
			<Modal {...props}
				   title={"Cập nhật danh mục"}
				   okText={"Cập nhật"}
				   cancelText={"Đóng"}
				   onOk={form.submit}
			>
				<Form form={form} onFinish={onFinish} >
					<Form.Item
						label={<Label minWidth={110} text={"Tên danh mục"} />}
						name={"name"}
						rules={[{required: true,type:"string",min:1, message: 'Vui lòng nhập tên danh mục'}]}
					>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	)
}