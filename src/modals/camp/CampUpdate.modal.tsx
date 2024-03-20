import { Form, InputNumber, Modal, ModalProps, Select } from "antd";
import { CampHelper } from "@/common/helpers/camp.helper.tsx";
import { campSelector } from "@store/camp/camp.slice.ts";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Label } from "@components/label/Label.tsx";
import { NumberUtil } from "@utils/number.util.ts";
import { Camp } from "@/@types/camp/camp.type.ts";
import { AppDispatch } from "@store/store.ts";
import CampThunk from "@store/camp/camp.thunk.ts";

export function CampUpdateModal(props: ModalProps) {

	const camp = useSelector(campSelector)
	const dispatch = useDispatch<AppDispatch>()
	useEffect(() => {
		if (props.open && camp.select) {
			form.resetFields()

			form.setFieldsValue({
				...camp.select
			})
		}
	}, [props.open]);

	const onFinish = (values: Partial<Camp>) => {
		dispatch(CampThunk.updateCamp({
			...camp.select,
			...values
		}))
		if (props.onCancel) {
			props.onCancel(undefined as any)
		}
	}

	const [form] = Form.useForm()
	return (
		<Modal {...props} title={"Cập nhật thông tin chiến dịch"} cancelText={"Đóng"} okText={"Cập nhật"} onOk={form.submit}>
			<Form form={form} onFinish={onFinish}>
				{/*giá chuyển đổi cho phép*/}
				<Form.Item label={<Label minWidth={140} text={"Giá CĐ cho phép"} />} name={"priceAllow"} initialValue={0}>
					<InputNumber style={{ width: "100%" }} min={0}
						formatter={value => NumberUtil.toMoney().fromNumber(value as any)}
						parser={value => NumberUtil.toMoney().fromString(value as any).toString() as any}
					/>
				</Form.Item>
				{/*loại*/}
				<Form.Item label={<Label minWidth={140} text={"Loại"} />} name={"typeCamp"}>
					<Select options={CampHelper.toListType()} />
				</Form.Item>
				{/*trạng thái*/}
				{/*<Form.Item label={<Label minWidth={140} text={"Trạng thái"}  />} name={"status"}>*/}
				{/*	<Select options={CampHelper.toListStatus()} />*/}
				{/*</Form.Item>*/}
			</Form>
		</Modal>
	)
}