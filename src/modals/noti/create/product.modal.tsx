import {notiSelector} from "@/common/store/noti/noti.slice";
import {Col, Row} from "antd";
import {useForm} from "antd/es/form/Form";
import {useSelector} from "react-redux";
import "./index.scss";
import {Product} from "@/@types/repo/product.type";
import {NumberUtil} from "@utils/number.util.ts";

export function ProductCreateModalNoti() {
  const noti = useSelector(notiSelector);
  const [form] = useForm();

  const getProduct = () => {
    if (noti.select) {
      const data = noti.select.data[0] as Product;
      return data;
    }
  }
  const warrantyUnit = () => {
    if (getProduct()?.warrantyUnit == "DAY") {
      return "Năm";
    } else if (getProduct()?.warrantyUnit == "MONTH") {
      return "Tháng";
    } else if (getProduct()?.warrantyUnit == "YEAR") {
      return "Ngày";
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
        <Col span={8}>
          <div>
            Đơn vị: <b>{getProduct()?.unit.name}</b>
          </div>
        </Col>
        <Col span={8}>
          <div>
            Danh mục: <b>{getProduct()?.category.name}</b>
          </div>
        </Col>
        <Col span={8}>
          <div>
            Kích thước: Dài <b style={{}}>{NumberUtil.toNumberMoney(getProduct()?.size[1])}</b> <b>x</b>{" "} Rộng<b> {NumberUtil.toNumberMoney(getProduct()?.size[0])}</b>
          </div>
        </Col>
        <Col span={16}>
          <div>
            Số lượng: <b>tối thiểu : </b>{" "} <b style={{}}>{NumberUtil.toNumberMoney(getProduct()?.inventory[0])}</b>{" - "} <b>tối đa : </b>{" "} <b>{NumberUtil.toNumberMoney(getProduct()?.inventory[1])}</b>
          </div>
        </Col>
        <Col span={8}>
          <div>
            Bảo hành: <b style={{}}>{getProduct()?.warrantyPeriod}</b> <b>{warrantyUnit()}</b>
          </div>
        </Col>
        <Col span={24}>
          <div>
            Mô tả: <b style={{}}>{getProduct()?.description}</b>
          </div>
        </Col>

      </Row>
    </div>
  );
}
