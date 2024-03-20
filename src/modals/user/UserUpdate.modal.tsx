import {Form, Input, Modal, ModalProps, Select} from "antd";
import {useForm} from "antd/es/form/Form";
import {Label} from "@components/label/Label.tsx";
import {RoleHelper} from "@/common/helpers/role.helper.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@store/store.ts";
import {User} from "@/@types/user.type.ts";
import UserThunk from "@store/user/user.thunk.ts";
import {useEffect} from "react";
import {userSelector} from "@store/user/user.slice.ts";

export default function UserUpdateModal(props: ModalProps) {
	const [form] = useForm()
	const dispatch = useDispatch<AppDispatch>()
	const user = useSelector(userSelector)
	const onFinish = (values: Partial<User>) => {
		dispatch(UserThunk.updateUser({
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
		<div id="UserUpdateModal">
			<Modal {...props}
				   title={"Cập nhật thông tin người dùng"}
				   okText={"Cập nhật"}
				   cancelText={"Đóng"}
				   onOk={form.submit}
				   
			>
				<Form form={form} onFinish={onFinish} >
					<Form.Item
						label={<Label minWidth={130} text={"Tên đăng nhập"} />}
						name={"username"}
						rules={[{required: true,type:"string",min:4, message: 'Vui lòng nhập tên đăng nhập'}]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label={<Label minWidth={130} text={"Tên đầy đủ"} />}
						name={"fullName"}
						rules={[{required: true,type:"string",min:4, message: 'Vui lòng nhập tên đầy đủ'}]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label={<Label minWidth={130} text={"Quyền"} />}
						name={"roles"}
						rules={[{required: true,type:"array", message: 'Vui lòng chọn quyền'}]}
					>
						<Select options={RoleHelper.toSelect()} mode={"multiple"}/>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	)
}