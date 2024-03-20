import {notiSelector} from "@/common/store/noti/noti.slice";
import {Col, Row} from "antd";
import {useForm} from "antd/es/form/Form";
import {useSelector} from "react-redux";
import {Product} from "@/@types/repo/product.type";

export function ProductSoudOutModalNoti() {
  const noti = useSelector(notiSelector);
  const [form] = useForm();

  const getProduct = () => {
    if (noti.select) {
      const data = noti.select.data[0] as Product;
      return data;
    }
  }

  return (
    <div>
      <Row gutter={[32, 20]}>
      <Col span={8}>
          <div>
            Tên sản phẩm: <b>{getProduct()?.name}</b>
          </div>
        </Col>
        <Col span={8}>
          <div>
            Mã : <b>{getProduct()?.code}</b>
          </div>
        </Col>
        <Col span={8}>
          <div>
            Link: <b>{getProduct()?.link}</b>
          </div>
        </Col>
        <Col span={24}>
          <div>
            <b>Note</b>: Sản phẩm trong kho còn lại ít hơn số lượng tối thiểu
          </div>
        </Col>
      </Row>
    </div>
  );
}
