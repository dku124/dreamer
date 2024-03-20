import {Button, Form, Input, Typography} from "antd";
import './Login.scss';
import {Label} from "@components/label/Label.tsx";
import {useDispatch} from "react-redux";
import {AuthThunk} from '@/common/store/auth/auth.thunk';
import {AppDispatch} from "@/common/store/store";
import logo from '@/assets/images/logo.png';

export default function LoginPage() {

	const [form] = Form.useForm();
	const dispatch = useDispatch<AppDispatch>();
	function handleSubmit() {
		form.validateFields().then((values) => {
			dispatch(AuthThunk.login(values));
		});
	}

    return (
		<div style={{minHeight:"100vh",paddingTop:"10vh"}}>
			<div className={"logo"} style={{width:"200px",margin:" 0 auto"}}>
				<img src={logo} alt="logo" width={"200px"}/>
			</div>
			<div id={"PageLogin"} >
				<h1 className={"title-form"}>
					<Typography.Title>
						Đăng nhập
					</Typography.Title>
				</h1>
				<Form form={form} onSubmitCapture={handleSubmit}>
					<Form.Item name={"username"} label={<Label text={"Tài khoản"}/>}>
						<Input/>
					</Form.Item>
					<Form.Item name={"password"} label={<Label text={"Mật khẩu"}/>}>
						<Input.Password/>
					</Form.Item>
					<Form.Item className={"center"}>
						<Button type={"primary"} loading={false} htmlType={"submit"}>Đăng nhập</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	)
}
