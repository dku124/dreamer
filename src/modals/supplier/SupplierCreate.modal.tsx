import {Button, Form, Input, Modal, ModalProps, Space} from "antd";
import {useForm} from "antd/es/form/Form";
import {Label} from "@components/label/Label.tsx";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@store/store.ts";
import {useEffect} from "react";
import {Supplier} from "@/@types/repo/supplier.type.ts";
import {TbTrashXFilled} from "react-icons/tb";
import SupplierThunk from "@store/supplier/supplier.thunk.ts";

export default function SupplierCreateModal(props: ModalProps) {
	const [form] = useForm()
	const dispatch = useDispatch<AppDispatch>()
	const onFinish = (values: Partial<Supplier>) => {
		dispatch(SupplierThunk.create(values))
		if (props.onCancel) {
			props.onCancel(undefined as any)
		}
	}
	useEffect(() => {
		form.resetFields()
	}, [props.open])


	return(
		<div id="SupplierCreateModal">
			<Modal {...props}
				   title={"Thêm nhà cung cấp"}
				   okText={"Thêm"}
				   cancelText={"Đóng"}
				   onOk={form.submit}
			>
				<Form form={form} onFinish={onFinish} >
					<Form.Item 
						name={"name"} 
						label={<Label minWidth={146} text={"Tên nhà cung cấp"}/>}
						rules={[{required: true,type:"string",min:4, message: 'Vui lòng nhập tên nhà cung cấp'}]}
					>
						<Input />
					</Form.Item>
					<Form.Item 
						name={"shortName"} 
						label={<Label minWidth={146} text={"Tên rút gọn"}/>}
						rules={[{required: true,type:"string",min:2, message: 'Vui lòng nhập tên rút gọn'}]}
					>
						<Input />
					</Form.Item>
					<Form.Item 
						name={"address"} 
						label={<Label minWidth={146} text={"Địa chỉ"}/>}
						rules={[{required: true,type:"string",min:2, message: 'Vui lòng nhập địa chỉ'}]}
					>
						<Input.TextArea />
					</Form.Item>
					<Form.Item
						name={"email"}
						label={<Label notRequired={false} minWidth={156} text={"Email"}/>}
						rules={[{required: false,type:"string",min:2, message: 'Vui lòng nhập địa chỉ email'}]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name={"description"}
						label={<Label notRequired={false} minWidth={156} text={"Mô tả"}/>}
						rules={[{required: false,type:"string",min:2, message: 'Vui lòng nhập mô tả'}]}
					>
						<Input.TextArea />
					</Form.Item>
					<Form.List  name={"phones"}>
						{(fields, {add, remove}) => (
							<>
								{fields.map(field => (
									<Form.Item
										{...field}
										label={<Label minWidth={146} text={"Số điện thoại"}/>}
										key={field.key}
										rules={[{required: true,type:"string",min:9, message: 'Vui lòng nhập số điện thoại'}]}
									>
										<Space.Compact>
											<Input width={"300px"}/>
											<Button shape={"round"} danger={true} type="primary" onClick={() => remove(field.name)} icon={<TbTrashXFilled size={20} />} />
										</Space.Compact>
									</Form.Item>
								))}
								<Form.Item>
									<Button type="primary" onClick={() => add()} block >
										Thêm số điện thoại
									</Button>
								</Form.Item>
							</>
						)}
					</Form.List>
				</Form>
			</Modal>
		</div>
	)
}