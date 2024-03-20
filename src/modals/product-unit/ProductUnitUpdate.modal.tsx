import {Form, Input, Modal, ModalProps} from "antd";
import {useForm} from "antd/es/form/Form";
import {Label} from "@components/label/Label.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@store/store.ts";
import {useEffect} from "react";
import ProductUnitThunk from "@store/product-unit/product-unit.thunk.ts";
import {ProductUnit} from "@/@types/repo/product-unit.type.ts";
import {productUnitSelector} from "@store/product-unit/product-unit.slice.ts";

export default function ProductUnitUpdateModal(props: ModalProps) {
	const [form] = useForm()
	const dispatch = useDispatch<AppDispatch>()
	const productUnit = useSelector(productUnitSelector)
	const onFinish = (values: Partial<ProductUnit>) => {
		dispatch(ProductUnitThunk.update({
			...productUnit.select,
			...values
		}))
		if (props.onCancel) {
			props.onCancel(undefined as any)
		}
	}
	useEffect(() => {
		form.resetFields()
		if (productUnit.select)
		{
			form.setFieldsValue(productUnit.select)
		}
		
	}, [props.open])


	return(
		<div id="ProductUnitCreateModal">
			<Modal {...props}
				   title={"Cập nhật đơn vị kho"}
				   okText={"Cập nhật"}
				   cancelText={"Đóng"}
				   onOk={form.submit}
			>
				<Form form={form} onFinish={onFinish} >
					<Form.Item
						label={<Label minWidth={110} text={"Tên đơn vị"} />}
						name={"name"}
						rules={[{required: true,type:"string",min:1, message: 'Vui lòng nhập tên đơn vị'}]}
					>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	)
}