import {Form, Input, Modal, ModalProps} from "antd";
import {useForm} from "antd/es/form/Form";
import {Label} from "@components/label/Label.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@store/store.ts";
import {useEffect} from "react";
import SettingThunk from "@store/setting/setting.thunk.ts";
import {ConfigCamp} from "@/@types/config/configCamp.type.ts";
import {settingSelector} from "@store/setting/setting.slice.ts";

export default function ConfigCampUpdateModal(props: ModalProps) {
	const [form] = useForm()
	const dispatch = useDispatch<AppDispatch>()
	const setting = useSelector(settingSelector)
	const onFinish = (values: Partial<ConfigCamp>) => {
		dispatch(SettingThunk.configCamp.update({
			...setting.configCamp.select,
			...values
		}))
		if (props.onCancel) {
			props.onCancel(undefined as any)
		}
	}
	useEffect(() => {
		form.resetFields()
		if (setting.configCamp.select) {
			form.setFieldsValue({
				note: setting.configCamp.select.note,
				token: setting.configCamp.select.token,
			})
		}
	}, [props.open])


	return(
		<div id="ConfigCampUpdateModal">
			<Modal {...props}
				   title={"Cập nhật token camp"}
				   okText={"Cập nhật"}
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