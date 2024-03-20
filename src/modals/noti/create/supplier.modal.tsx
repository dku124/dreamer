import { notiSelector } from "@/common/store/noti/noti.slice";
import { Col, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { useSelector } from "react-redux";
import "./index.scss";
import { Supplier } from "@/@types/repo/supplier.type";

export function SupplierCreateModalNoti() {
  const noti = useSelector(notiSelector);
  const [form] = useForm();

  const getOder = () => {
    if (noti.select) {
      const data = noti.select.data[0] as Supplier;
      return data;
    }
  };

  return (
    <div>
      <Row gutter={[32, 20]}>
        <Col span={12}>
          <div>
            Tên nhà cung cấp: <b>{getOder()?.name}</b>
          </div>
        </Col>
        <Col span={12}>
          <div>
            Tên rút gọn: <b>{getOder()?.shortName}</b>
          </div>
        </Col>
        <Col span={12}>
          <div>
            Địa chỉ: <b>{getOder()?.address}</b>
          </div>
        </Col>
        <Col span={12}>
          {getOder()?.email ? <div>
            Email: <b>{getOder()?.email}</b>
          </div> : ''}
        </Col>
        <Col span={24}>
          <Row gutter={[32, 20]}>
            {getOder()?.phones.map((item, index) => {
              return (
                <Col span={12} key={index}>
                  <div>
                    Số điện thoại: <b>{item}</b>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Col>
        <Col span={24}>
          <div>
            Mô tả: <b>{getOder()?.description}</b>
          </div>
        </Col>
      </Row>
    </div>
  );
}
