import { Form, Input, InputNumber, Modal, ModalProps } from "antd";
import { campSelector } from "@store/camp/camp.slice.ts";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Label } from "@components/label/Label.tsx";
import { NumberUtil } from "@utils/number.util.ts";
import { AppDispatch } from "@store/store.ts";
import { Camp } from "@/@types/camp/camp.type.ts";
import CampThunk from "@store/camp/camp.thunk.ts";

export function AdUpdateModal(props: ModalProps) {
	const camp = useSelector(campSelector);
	const dispatch = useDispatch<AppDispatch>();
	useEffect(() => {
		if (props.open && camp.adSelect) {
			form.resetFields();
			form.setFieldsValue({
				...camp.adSelect,
				cpc: NumberUtil.toInt(camp.adSelect.cpc || 0),
				cpm: NumberUtil.toInt(camp.adSelect.cpm || 0),
			});
		}
	}, [props.open]);

	const onFinish = (values: Partial<Camp>) => {
		dispatch(
			CampThunk.updateAd({
				ad: { ...camp.adSelect, ...values },
				query: {
					ad_id: camp?.adSelect?.ad_id,
					date: camp?.query?.from,
				},
			}),
		);
		if (props.onCancel) {
			props.onCancel(undefined as any);
		}
	};

	const [form] = Form.useForm();
	return (
		<Modal
			{...props}
			title={"Cập nhật thông tin quảng cáo"}
			cancelText={"Đóng"}
			okText={"Cập nhật"}
			onOk={form.submit}
		>
			<Form form={form} onFinish={onFinish}>
				<Form.Item
					label={<Label minWidth={140} text={"Tên quảng cáo"} />}
					name={"campaign_name"}
				>
					<Input />
				</Form.Item>
				{/*giá chuyển đổi cho phép*/}
				<Form.Item
					label={<Label minWidth={140} text={"Chi phí quảng cáo"} />}
					name={"adsSpend"}
					initialValue={0}
				>
					<InputNumber
						style={{ width: "100%" }}
						min={0}
						formatter={(value) =>
							NumberUtil.toMoney().fromNumber(value as any)
						}
						parser={(value) =>
							NumberUtil.toMoney()
								.fromString(value as any)
								.toString() as any
						}
					/>
				</Form.Item>
				<Form.Item
					label={<Label minWidth={140} text={"Số click"} />}
					name={"clicks"}
					initialValue={0}
				>
					<InputNumber
						style={{ width: "100%" }}
						min={0}
						formatter={(value) =>
							NumberUtil.toMoney().fromNumber(value as any)
						}
						parser={(value) =>
							NumberUtil.toMoney()
								.fromString(value as any)
								.toString() as any
						}
					/>
				</Form.Item>
				<Form.Item
					label={<Label minWidth={140} text={"CPM"} />}
					name={"cpm"}
					initialValue={0}
				>
					<InputNumber
						style={{ width: "100%" }}
						min={0}
						formatter={(value) =>
							NumberUtil.toMoney().fromNumber(value as any)
						}
						parser={(value) =>
							NumberUtil.toMoney()
								.fromString(value as any)
								.toString() as any
						}
					/>
				</Form.Item>
				<Form.Item
					label={<Label minWidth={140} text={"CPC"} />}
					name={"cpc"}
					initialValue={0}
				>
					<InputNumber
						style={{ width: "100%" }}
						min={0}
						formatter={(value) =>
							NumberUtil.toMoney().fromNumber(value as any)
						}
						parser={(value) =>
							NumberUtil.toMoney()
								.fromString(value as any)
								.toString() as any
						}
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
}
