import {Form, Input, InputNumber, Modal, ModalProps} from "antd";
import {useForm} from "antd/es/form/Form";
import {Label} from "@components/label/Label.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@store/store.ts";
import {useEffect} from "react";
import SettingThunk from "@store/setting/setting.thunk.ts";
import {ConfigUnit} from "@/@types/config/configUnit.type.ts";
import {settingSelector} from "@store/setting/setting.slice.ts";

export default function ConfigUnitUpdateModal(props: ModalProps) {
	const [form] = useForm()
	const dispatch = useDispatch<AppDispatch>()
	const setting = useSelector(settingSelector)
	const onFinish = (values: Partial<ConfigUnit>) => {
		dispatch(SettingThunk.configUnit.update({
			...setting.configUnit.select,
			...values
		}))
		if (props.onCancel) {
			props.onCancel(undefined as any)
		}
	}
	useEffect(() => {
		form.resetFields()
		if (setting.configUnit.select) {
			form.setFieldsValue({
				key: setting.configUnit.select.key,
				value: setting.configUnit.select.value,
			})
		}
	}, [props.open])


	return(
		<div id="ConfigUnitUpdateModal">
			<Modal {...props}
				   title={"Cập nhật đơn vị tiền"}
				   okText={"Cập nhật"}
				   onOk={form.submit}
			>
				<Form form={form} onFinish={onFinish} >
					<Form.Item
						label={<Label minWidth={110} text={"Tên"} />}
						name={"key"}
						rules={[{required: true,type:"string",min:1, message: 'Vui lòng nhập tên'}]}
					>
						<Input disabled={true} />
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