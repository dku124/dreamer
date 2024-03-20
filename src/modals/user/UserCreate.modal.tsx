import {Form, Input, Modal, ModalProps, Select} from "antd";
import {useForm} from "antd/es/form/Form";
import {Label} from "@components/label/Label.tsx";
import {RoleHelper} from "@/common/helpers/role.helper.tsx";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@store/store.ts";
import {User} from "@/@types/user.type.ts";
import UserThunk from "@store/user/user.thunk.ts";
import {useEffect} from "react";

export default function UserCreateModal(props: ModalProps) {
	const [form] = useForm()
	const dispatch = useDispatch<AppDispatch>()
	const onFinish = (values: Partial<User>) => {
		dispatch(UserThunk.createUser(values))
		if (props.onCancel) {
			props.onCancel(undefined as any)
		}
	}
	useEffect(() => {
		form.resetFields()
	}, [props.open])
	
	
	return(
		<div id="UserCreateModal">
			<Modal {...props} 
				   title={"Thêm người dùng"}  
				   okText={"Thêm"}
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
						label={<Label minWidth={130} text={"Mật khẩu"} />} 
						name={"password"}
						rules={[{required: true,type:"string",min:4, message: 'Vui lòng nhập mật khẩu'}]}
					>
						<Input.Password />
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