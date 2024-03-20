import {Form, Input, Modal, ModalProps} from "antd";
import {useForm} from "antd/es/form/Form";
import {Label} from "@components/label/Label.tsx";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@store/store.ts";
import {useEffect} from "react";
import CategoryThunk from "@store/category/category.thunk.ts";
import {Category} from "@/@types/repo/category.type.ts";

export default function CategoryCreateModal(props: ModalProps) {
	const [form] = useForm()
	const dispatch = useDispatch<AppDispatch>()
	const onFinish = (values: Partial<Category>) => {
		dispatch(CategoryThunk.create(values))
		if (props.onCancel) {
			props.onCancel(undefined as any)
		}
	}
	useEffect(() => {
		form.resetFields()
	}, [props.open])


	return(
		<div id="ProductUnitCreateModal">
			<Modal {...props}
				   title={"Thêm danh mục"}
				   okText={"Thêm"}
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