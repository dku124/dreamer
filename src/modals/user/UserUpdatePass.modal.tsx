import {Form, Input, Modal, ModalProps} from "antd";
import {useForm} from "antd/es/form/Form";
import {Label} from "@components/label/Label.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@store/store.ts";
import {User} from "@/@types/user.type.ts";
import UserThunk from "@store/user/user.thunk.ts";
import {useEffect} from "react";
import {userSelector} from "@store/user/user.slice.ts";

export default function UserUpdatePassModal(props: ModalProps) {
	const [form] = useForm()
	const dispatch = useDispatch<AppDispatch>()
	const user = useSelector(userSelector)
	const onFinish = (values: Partial<User>) => {
		dispatch(UserThunk.updatePassword({
			...user.select,
			...values
		}))
		if (props.onCancel) {
			props.onCancel(undefined as any)
		}
	}
	useEffect(() => {
		form.resetFields()
		if (user.select) {
			form.setFieldsValue(user.select)
		}
	}, [props.open])


	return(
		<div id="UserUpdatePassModal">
			<Modal {...props}
				   title={"Cấp mật khẩu mới"}
				   cancelText={"Đóng"}
				   okText={"Cấp mới"}
				   onOk={form.submit}
			>
				<Form form={form} onFinish={onFinish} >
					<Form.Item
						label={<Label minWidth={130} text={"Tên đăng nhập"} />}
						name={"username"}
						
						rules={[{required: true,type:"string",min:4, message: 'Vui lòng nhập tên đăng nhập'}]}
					>
						<Input disabled={true} />
					</Form.Item>
					<Form.Item
						label={<Label minWidth={130} text={"Mật khẩu"} />}
						name={"password"}
						rules={[{required: true,type:"string",min:4, message: 'Vui lòng nhập mật khẩu'}]}
					>
						<Input.Password />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	)
}