import {useDispatch, useSelector} from "react-redux";
import {settingSelector} from "@store/setting/setting.slice.ts";
import {AppDispatch} from "@store/store.ts";
import {useEffect} from "react";
import SettingThunk from "@store/setting/setting.thunk.ts";
import './Config.scss'
import {Button, Form, InputNumber, Radio, Spin} from "antd";
import {Label} from "@components/label/Label.tsx";
import {Config, Mode} from "@/@types/config/config.type.ts";

export default function Config()
{
	const dispatch = useDispatch<AppDispatch>()
	const setting = useSelector(settingSelector)
	const [form] = Form.useForm()
	useEffect(() =>{
		dispatch(SettingThunk.config.get())
	}, [])
	
	useEffect(() =>{
		form.setFieldsValue({
			mode: setting.config?.mode,
			percent: setting.config?.percent,
		})
	}, [setting.config])
	
	const onFinish = (values: Config) =>{
		dispatch(SettingThunk.config.update(values))
	}
	
	return ( 
		<div id={"Config"}>
			<Spin spinning={setting.config==undefined}>
				<Form form={form}  layout={"vertical"}  onFinish={onFinish}  >
					<Form.Item name={"mode"} label={<Label  text={"Chế độ chia đơn"}/>}>
						<Radio.Group>
							<Radio.Button value={Mode.AUTO}>Tự động</Radio.Button>
							<Radio.Button value={Mode.DISABLE}>Thủ công</Radio.Button>
						</Radio.Group>
					</Form.Item>
					<Form.Item name={"percent"} label={<Label  text={"Tỉ lệ vượt ads"}/>}>
						<InputNumber min={0} max={100} addonAfter={"%"}  />
					</Form.Item>
					<Form.Item>
						<Button type={"primary"} htmlType={"submit"}>Lưu</Button>
					</Form.Item>
				</Form>
			</Spin>
		</div>
	)
}