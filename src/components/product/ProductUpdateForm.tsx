import {Col, Form, Input, InputNumber, Row, Select, Space} from "antd";
import {Label} from "@components/label/Label.tsx";
import {ProductHelper} from "@/common/helpers/product.helper.tsx";
import {ProductUnitHelper} from "@/common/helpers/productUnit.helper.tsx";
import {CategoryHelper} from "@/common/helpers/category.helper.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@store/store.ts";
import {productUnitSelector} from "@store/product-unit/product-unit.slice.ts";
import {categorySelector} from "@store/category/category.slice.ts";
import {productSelector} from "@store/product/product.slice.ts";

export default function ProductUpdateForm(props: any) {
  const { form, onFinish } = props;
  const dispatch = useDispatch<AppDispatch>();
  const productUnit = useSelector(productUnitSelector);
  const category = useSelector(categorySelector);
  const product = useSelector(productSelector);
  return (
    <Row
      gutter={{
        xs: 8,
        sm: 16,
        md: 24,
        lg: 32,
        xl: 32,
        xxl: 32,
      }}
    >
      <Col span={12}>
        <Form.Item
          label={<Label minWidth={90} text={"Tên"} />}
          name={"name"}
          rules={[
            {
              required: true,
              message: "Tên sản phẩm không được để trống",
              type: "string",
              min: 3,
            },
          ]}
        >
          <Input placeholder={"Tên sản phẩm"} />
        </Form.Item>
        <Form.Item
          label={<Label minWidth={90} text={"Mã"} />}
          name={"code"}
          rules={[
            {
              required: true,
              message: "Mã sản phẩm không được để trống",
              type: "string",
              whitespace: true,
            },
          ]}
        >
          <Input disabled={true} placeholder={"Mã sản phẩm"} />
        </Form.Item>
        <Form.Item
          label={<Label minWidth={90} text={"Link"} />}
          name={"link"}
          rules={[
            {
              required: true,
              message: "Link sản phẩm không được để trống",
              type: "string",
              whitespace: true,
            },
          ]}
        >
          <Input placeholder={"Link sản phẩm"} />
        </Form.Item>
        <Form.Item
          label={<Label minWidth={100} text={"Kích thước"} />}
          name={"size"}
        >
          <Row>
            <Col span={11}>
              <Form.Item noStyle={true} name={"height"}>
                <InputNumber
                  min={0}
                  className={"w100"}
                  addonBefore={"Chiều dài"}
                />
              </Form.Item>
            </Col>

            <Col span={2}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h3>X</h3>
              </div>
            </Col>
            <Col span={11}>
              <Form.Item noStyle={true} name={"width"}>
                <InputNumber
                  min={0}
                  className={"w100"}
                  addonBefore={"Chiều rộng"}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          label={<Label minWidth={100} text={"Số lượng"} />}
          name={"quantity"}
        >
          <Space.Compact>
            <Form.Item 
				rules={[{type:"number",min:1,message:"Số lượng tối thiểu là 1"}]}
				noStyle={true} name={"quantityMin"}>
              <InputNumber
                style={{
                  borderRadius: "5px",
                }}
                min={1}
                addonBefore={"Tối thiểu"}
              />
            </Form.Item>
            <div
              style={{
                width: "20px",
                paddingLeft: "10px",
                paddingRight: "10px",
              }}
            >
              <h3>-</h3>
            </div>
            <Form.Item 
				rules={[{type:"number",min:1,message:"Số lượng tối đa phải lớn hơn 1"}]}
				noStyle={true} name={"quantityMax"}>
              <InputNumber
                style={{
                  borderRadius: "5px",
                }}
                name={"quantityMax"}
                min={1}
                addonBefore={"Tối đa"}
              />
            </Form.Item>
          </Space.Compact>
        </Form.Item>
        <Form.Item label={<Label minWidth={100} text={"Bảo hành"} />}>
          <Space.Compact style={{ width: "100%" }}>
            <Form.Item noStyle={true} name={["warrantyPeriod"]}>
              <InputNumber
                style={{
                  borderRadius: "5px",
                }}
                min={0}
                addonBefore={"Thời gian"}
              />
            </Form.Item>
            <Form.Item noStyle={true} name={["warrantyUnit"]}>
              <Select
                placeholder={"Đơn vị bảo hành"}
                options={ProductHelper.toWarranty()}
              />
            </Form.Item>
          </Space.Compact>
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label={<Label minWidth={100} text={"Đơn vị"} />}
          name={"unit"}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            placeholder={"Đơn vị sản phẩm"}
            options={ProductUnitHelper.toOptions(productUnit.list)}
          />
        </Form.Item>
        <Form.Item
          label={<Label minWidth={100} text={"Danh mục"} />}
          name={"category"}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            placeholder={"Danh mục sản phẩm"}
            options={CategoryHelper.toOptions(category.list)}
          />
        </Form.Item>
        <Form.Item
          label={<Label minWidth={100} text={"Mô tả"} />}
          name={"description"}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea rows={10} placeholder={"Mô tả sản phẩm"} />
        </Form.Item>
      </Col>
    </Row>
  );
}
