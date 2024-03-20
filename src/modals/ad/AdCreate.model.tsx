import { Form, Input, InputNumber, Modal, ModalProps, Select } from "antd";
import { CampHelper } from "@/common/helpers/camp.helper.tsx";
import { campSelector } from "@store/camp/camp.slice.ts";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Label } from "@components/label/Label.tsx";
import { NumberUtil } from "@utils/number.util.ts";
import { Camp } from "@/@types/camp/camp.type.ts";
import { AppDispatch } from "@store/store.ts";
import CampThunk from "@store/camp/camp.thunk.ts";
import { productSelector, setSelectProduct } from "@/common/store/product/product.slice";
import ProductThunk from "@/common/store/product/product.thunk";
import { configSelector } from "@/common/store/config/config.slice";
import { Ad } from "@/@types/camp/ad.type";
import { setConfigUnitSelect, settingSelector } from "@/common/store/setting/setting.slice";
import SettingThunk from "@/common/store/setting/setting.thunk";

export function AdCreateModal(props: ModalProps) {
    const dispatch = useDispatch<AppDispatch>()
    const camp = useSelector(campSelector)
    const [form] = Form.useForm()
    const onFinish = (values: Partial<Ad>) => {
        console.log(camp)
        dispatch(CampThunk.CreateAd({ ...values, camp: camp.select?._id }))
        if (props.onCancel) {
            props.onCancel(undefined as any);
        }
    };
    const { configUnit: { list: currencyList = [], select: selectedCurrency } } = useSelector(settingSelector);

    useEffect(() => {
        dispatch(SettingThunk.configUnit.getList());
    }, [dispatch]);

    const handleCurrencyChange = (currencyName: string) => {
        const currency = currencyList.find((item) => item.key === currencyName);
        if (currency) {
            dispatch(setConfigUnitSelect(currency));
        }
    };
    return (
        <Modal {...props} title={"Tạo quảng cáo mới"} cancelText={"Đóng"} okText={"Tạo mới"} onOk={form.submit} width={600}>
            <Form form={form} onFinish={onFinish}>
                <Form.Item
                    label={<Label minWidth={140} text={"Tên quảng cáo"} />}
                    name="campaign_name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên quảng cáo' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={<Label minWidth={140} text={"Tên tài khoản QC"} />}
                    name="account_name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản quảng cáo' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={<Label minWidth={140} text={"Đơn vị tiền tệ"} />}
                    name="account_currency"
                    rules={[{ required: true, message: 'Vui lòng chọn đơn vị tiền tệ' }]}
                >
                    <Select onChange={handleCurrencyChange} value={selectedCurrency?.key}>
                        {currencyList.map((currency) => (
                            <Select.Option key={currency.key} value={currency.key}>
                                {currency.key}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label={<Label minWidth={140} text={"Mã của quảng cáo"} />}
                    name="ad_id"
                    rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản quảng cáo' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label={<Label minWidth={140} text={"CPM"} />}
                    name="cpm" initialValue={0} rules={[{ required: true, message: 'Vui lòng nhập đúng' }]}>
                    <InputNumber style={{ width: "100%" }} min={0}
                        formatter={value => NumberUtil.toMoney().fromNumber(value as any)}
                        parser={value => NumberUtil.toMoney().fromString(value as any).toString() as any}
                    />
                </Form.Item>
                <Form.Item label={<Label minWidth={140} text={"CPC"} />} name="cpc" initialValue={0} rules={[{ required: true, message: 'Vui lòng nhập đúng' }]}>
                    <InputNumber style={{ width: "100%" }} min={0}
                        formatter={value => NumberUtil.toMoney().fromNumber(value as any)}
                        parser={value => NumberUtil.toMoney().fromString(value as any).toString() as any}
                    />
                </Form.Item>
                <Form.Item label={<Label minWidth={140} text={"Chi phí quảng cáo"} />} name="adsSpend" initialValue={0} rules={[{ required: true, message: 'Vui lòng nhập đúng' }]}>
                    <InputNumber style={{ width: "100%" }} min={0}
                        formatter={value => NumberUtil.toMoney().fromNumber(value as any)}
                        parser={value => NumberUtil.toMoney().fromString(value as any).toString() as any}
                    />
                </Form.Item>
                <Form.Item label={<Label minWidth={140} text={"Clicks"} />}  name="clicks" initialValue={0} rules={[{ required: true, message: 'Vui lòng nhập đúng' }]}>
                    <InputNumber style={{ width: "100%" }} min={0}
                        formatter={value => NumberUtil.toMoney().fromNumber(value as any)}
                        parser={value => NumberUtil.toMoney().fromString(value as any).toString() as any}
                    />
                </Form.Item>

            </Form>
        </Modal>
    );

}