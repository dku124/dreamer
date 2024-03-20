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

export function CampCreateModal(props: ModalProps) {
    const dispatch = useDispatch<AppDispatch>()
    const { select: selectedProduct, lists: productList } = useSelector(productSelector);
    const [form] = Form.useForm()
    const onFinish = (values: Partial<Camp>) => {
        dispatch(CampThunk.CreateCamp({ ...values, product: selectedProduct }));
        if (props.onCancel) {
            props.onCancel(undefined as any);
        }
    };

    const handleProductChange = (productId: string) => {
        const product = productList.find((item) => item._id === productId);
        if (product) {
            dispatch(setSelectProduct(product));
        }
    };

    useEffect(() => {
        dispatch(ProductThunk.getList(''));
    }, [dispatch]);
    return (
        <Modal {...props} title={"Tạo chiến dịch mới"} cancelText={"Đóng"} okText={"Tạo mới"} onOk={form.submit} width={600}>
            <Form form={form} onFinish={onFinish}>
                <Form.Item
                    label={<Label minWidth={140} text={"Tên Chiến dịch"} />}
                    name="campName"
                    rules={[{ required: true, message: 'Vui lòng nhập tên chiến dịch' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label={<Label minWidth={140} text={"Loại Chiến dịch"} />} name="typeCamp" rules={[{ required: true, message: 'Vui lòng chọn đúng' }]}>
                    <Select options={CampHelper.toListType()} />
                </Form.Item>
                <Form.Item label={<Label minWidth={140} text={"Giá CĐ cho phép"} />} name="priceAllow" initialValue={0} rules={[{ required: true, message: 'Vui lòng nhận đúng' }]}>
                    <InputNumber style={{ width: "100%" }} min={0}
                        formatter={value => NumberUtil.toMoney().fromNumber(value as any)}
                        parser={value => NumberUtil.toMoney().fromString(value as any).toString() as any}
                    />
                </Form.Item>
                <Form.Item label={<Label minWidth={140} text={"Sản phẩm"} />} name="product" rules={[{ required: true, message: 'Vui lòng chọn sản phẩm' }]}>
                    <Select onChange={handleProductChange} defaultValue={selectedProduct?._id}>
                        {productList.map((product) => (
                            <Select.Option key={product._id} value={product._id}>
                                {product.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label={<Label minWidth={140} text={"Trạng thái"} />} name="status" rules={[{ required: true, message: 'Vui lòng trạng thái' }]}>
                    <Select options={CampHelper.toListStatus()} />
                </Form.Item>
            </Form>
        </Modal>
    );

}