import {notiSelector} from "@/common/store/noti/noti.slice";
import {Col, Row} from "antd";
import {useForm} from "antd/es/form/Form";
import {useSelector} from "react-redux";
import "./index.scss";
import {ProductUnit} from "@/@types/repo/product-unit.type";

export function ProductUnitCreateModalNoti() {
  const noti = useSelector(notiSelector);
  const [form] = useForm();

  const getUnit = () => {
    if (noti.select) {
      const data = noti.select.data[0] as ProductUnit;
      return data;
    }
  };

  return (
    <div>
      <Row gutter={[32, 20]}>
        <Col span={12}>
          <div>
            Tên nhà cung cấp: <b>{getUnit()?.name}</b>
          </div>
        </Col>
      </Row>
    </div>
  );
}
