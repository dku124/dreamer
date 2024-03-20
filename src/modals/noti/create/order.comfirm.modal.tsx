import {notiSelector} from "@/common/store/noti/noti.slice";
import {Col, Row} from "antd";
import {useForm} from "antd/es/form/Form";
import {useSelector} from "react-redux";
import "./index.scss";
import {Order} from "@/@types/order/order.type";
import {NumberUtil} from "@/common/utils/number.util";

export function OrderComfirmModalNoti() {
  const noti = useSelector(notiSelector);
  const [form] = useForm();

  const getOder = () => {
    if (noti.select) {
      const data = noti.select.data[0] as Order;
      return data;
    }
  }

  return (
    <div>
      <Row gutter={[32, 20]}>
        <Col span={12}>
          <div>
            Tên khách hàng: <b>{getOder()?.ship.to.fullName}</b>
          </div>
        </Col>
        <Col span={12}>
          <div>
            Số điện thoại: <b>{getOder()?.ship.to.phone}</b>
          </div>
        </Col>
        <Col span={24}>
          <div>
            Địa chỉ: <b>{getOder()?.ship.to.address}</b>
          </div>
        </Col>
        <Col span={24}>
          {
            getOder()?.details.map((item,index) => {
              const priceTotal = (item.price * item.quantity) + (item.color.size.price * item.quantity);
                return (
                    <div key={index}>
                    <Row gutter={[32, 20]}>
                        <Col span={8}>
                            <div>
                                Tên sản phẩm: <b>{item.product.name}</b>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div>
                                Số lượng: <b>{item.quantity}</b>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div>
                                Giá: <b>{NumberUtil.toMoney().fromNumber(priceTotal)}</b>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div>
                                Màu: <b>{item.color.color}</b>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div>
                                Size: <b>{item.color.size.size}</b>
                            </div>
                        </Col>
                        
                    </Row>
                    </div>
                )
                })
          }
        </Col>
        <Col span={24}>
          <div>
           Sale: <b>{getOder()?.sale.fullName}</b>
          </div>
        </Col>
      </Row>
    </div>
  );
}
