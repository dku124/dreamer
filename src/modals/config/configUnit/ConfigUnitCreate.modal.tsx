import {Form, Input, InputNumber, Modal, ModalProps} from "antd";
import {useForm} from "antd/es/form/Form";
import {Label} from "@components/label/Label.tsx";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@store/store.ts";
import {useEffect} from "react";
import SettingThunk from "@store/setting/setting.thunk.ts";
import {ConfigUnit} from "@/@types/config/configUnit.type.ts";

export default function ConfigUnitCreateModal(props: ModalProps) {
	const [form] = useForm()
	const dispatch = useDispatch<AppDispatch>()
	const onFinish = (values: Partial<ConfigUnit>) => {
		dispatch(SettingThunk.configUnit.create(values))
		if (props.onCancel) {
			props.onCancel(undefined as any)
		}
	}
	useEffect(() => {
		form.resetFields()
	}, [props.open])


	return(
		<div id="ConfigUnitCreateModal">
			<Modal {...props}
				   title={"Thêm đơn vị tiền"}
				   okText={"Thêm"}
				   onOk={form.submit}
			>
				<Form form={form} onFinish={onFinish} >
					<Form.Item
						label={<Label minWidth={110} text={"Tên"} />}
						name={"key"}
						rules={[{required: true,type:"string",min:1, message: 'Vui lòng nhập tên'}]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label={<Label minWidth={110} text={"Số tiền"} />}
						name={"value"}
						rules={[{required: true,type:"number",min:1, message: 'Vui lòng nhâp số tiền'}]}
					>
						<InputNumber  style={{width:"100%"}}/>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	)
}