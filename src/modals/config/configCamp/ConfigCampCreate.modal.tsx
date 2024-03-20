import {Form, Input, Modal, ModalProps} from "antd";
import {useForm} from "antd/es/form/Form";
import {Label} from "@components/label/Label.tsx";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@store/store.ts";
import {useEffect} from "react";
import SettingThunk from "@store/setting/setting.thunk.ts";
import {ConfigCamp} from "@/@types/config/configCamp.type.ts";

export default function ConfigCampCreateModal(props: ModalProps) {
	const [form] = useForm()
	const dispatch = useDispatch<AppDispatch>()
	const onFinish = (values: Partial<ConfigCamp>) => {
		dispatch(SettingThunk.configCamp.create(values))
		if (props.onCancel) {
			props.onCancel(undefined as any)
		}
	}
	useEffect(() => {
		form.resetFields()
	}, [props.open])


	return(
		<div id="ConfigCampCreateModal">
			<Modal {...props}
				   title={"Thêm token camp"}
				   okText={"Thêm"}
				   onOk={form.submit}
			>
				<Form form={form} onFinish={onFinish} >
					<Form.Item
						label={<Label minWidth={110} text={"Ghi chú"} />}
						name={"note"}
						rules={[{required: true,type:"string",min:1, message: 'Vui lòng nhập ghi chú'}]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label={<Label minWidth={110} text={"Token"} />}
						name={"token"}
						rules={[{required: true,type:"string",min:1, message: 'Vui lòng nhập token'}]}
					>
						<Input.TextArea />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	)
}