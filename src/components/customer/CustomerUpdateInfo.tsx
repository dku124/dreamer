import {DatePicker, Form, Input, Modal, ModalProps, Select} from "antd";
import {Label} from "@components/label/Label.tsx";
import {DateUtil} from "@utils/date.util.tsx";
import {customerSelector} from "@store/customer/customer.slice.ts";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {AppDispatch} from "@store/store.ts";
import CustomerThunk from "@store/customer/customer.thunk.ts";
import dayjs from "dayjs";

export function CustomerUpdateInfoModal(props:ModalProps)
{
	const customer = useSelector(customerSelector)
	const dispatch = useDispatch<AppDispatch>()
	const [form] = Form.useForm()
	useEffect(() => {
		if(props.open)
		{
			form.setFieldsValue({
				...customer.select?.addOnInfo,
				dateOfBirth:customer.select?.addOnInfo?.dateOfBirth ? dayjs(customer.select?.addOnInfo?.dateOfBirth) : undefined
			})
		}
	}, []);
	
	const onFinish = (values:any) => {
		dispatch(CustomerThunk.update({
			...customer.select,
			addOnInfo:{
				...customer.select?.addOnInfo,
				...values,
			}
		}))
		if (props.onCancel) {
			props.onCancel(undefined as any)
		}
	}
	
	
	return (
		<Modal {...props} title={"Cập nhật thông tin khách hàng"} okText={"Cập nhật"} cancelText={"Đóng"} onOk={form.submit}>
			<Form form={form} layout={"horizontal"} onFinish={onFinish}>
				<Form.Item  name={"dateOfBirth"} label={<Label text={"Ngày sinh"}  />  } >
					<DatePicker  format={DateUtil.dateFormat}  style={{width:"100%"}} />
				</Form.Item>
				<Form.Item name={"gender"} label={<Label text={"Giới tính"}  />  } >
					<Select placeholder={"Giới tính"} options={[{label:"Nam",value:0},{label:"Nữ",value:1}]} />	
				</Form.Item>
				<Form.Item name={"type"} label={<Label text={"Loại KH"}  />  } >
					<Select placeholder={"Loại KH"} options={[{label:"Cá nhân",value:0},{label:"Doanh nghiệp",value:1}]} />
				</Form.Item>
				<Form.Item name={"fb"} label={<Label text={"Facebook"}  />  } >
					<Input placeholder={"Facebook"} />
				</Form.Item>
				<Form.Item name={"email"} label={<Label text={"Email"}  />  } >
					<Input  placeholder={"Email"} />
				</Form.Item>
				<Form.Item name={"note"} label={<Label text={"Ghi chú"}  />  } >
					<Input.TextArea  placeholder={"Ghi chú"} />
				</Form.Item>
			</Form>
		</Modal>
	)
}