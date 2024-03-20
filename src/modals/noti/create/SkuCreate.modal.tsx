import {SKU} from "@/@types/repo/sku.type";
import {notiSelector} from "@/common/store/noti/noti.slice";
import {DateUtil} from "@utils/date.util.tsx";
import {NumberUtil} from "@/common/utils/number.util";
import {Col, Row} from "antd";
import {useForm} from "antd/es/form/Form";
import {useEffect} from "react";
import {FaDotCircle} from "react-icons/fa";
import {useSelector} from "react-redux";

export function SkuCreateModalNoti() {
  const noti = useSelector(notiSelector);
  const [form] = useForm();

  useEffect(() => {
    if (noti.select) {
      const data = noti.select?.data[0] as SKU;
      form.setFieldsValue({
        sku: data.code,
        address: data.importAddress,
        // có bao nhiêu mà thì hiển thị bấy nhiêu và cả số lượng của màu đó nữa
        color: data.colors
      });
    }
  }, [noti.select]);

  const getSku = () => {
    if (noti.select) {
      const data = noti.select?.data[0] as SKU;
      return data;
    }
  };


  return (
    <div>
      <Row gutter={[32,20]}>
        <Col span={8}>
            <div>
            Mã SKU: <b>{getSku()?.code}</b>
            </div>
        </Col>
        <Col span={8}>
            <div>
            Địa chỉ nhập: <b>{getSku()?.importAddress}</b>
            </div>
        </Col>
        <Col span={8}>
            <div>
            Ngày nhập: <b>{DateUtil.format(getSku()?.importDate)}</b>
            </div>
        </Col>
        {/*<Col span={8}>*/}
        {/*    <div>*/}
        {/*        Giá nhập : <b>{NumberUtil.toNumberMoney(getSku()?.importPrice)}</b>*/}
        {/*    </div>*/}
        {/*</Col>*/}
        <Col span={8}>
            <div>
                Giá bán (lẻ) : <b>{NumberUtil.toNumberMoney(getSku()?.price)}</b>
            </div>
        </Col>
        <Col span={8}>
            <div>
                Giá bán (sỉ) : <b>{NumberUtil.toNumberMoney(getSku()?.retailPrice)}</b>
            </div>
        </Col>
        <Col span={8}>
            <div>
                Nhà cung cấp : <b>{getSku()?.supplier.name}</b>
            </div>
        </Col>
        <Col span={8}>
            <div>
                Hàng đã về kho : <b>{getSku()?.state ? "Đã về":"Chưa về"}</b>
            </div>
        </Col>
        <Col span={8}>
            <div>
                Ghi chú : <b>{getSku()?.note}</b>
            </div>
        </Col>
        <Col span={24} style={{paddingLeft:"15px"}}>
            {
                getSku()?.colors.map((color,index) => {
                    return (
                        <Row gutter={[32,20]}>
                            <Col span={24}>
                                <div>
                                    Màu: <b>{color.color}</b>
                                </div>
                            </Col>
                            <Col span={24}>
                            {
                                color.sizes.map((size,index) => {
                                    return (
                                        <Row style={{marginLeft:"30px"}} gutter={[10,20]}>
                                            <Col span={8} >
                                                <div>
                                                    <FaDotCircle /> Size: <b>{size.size}</b>
                                                </div>
                                            </Col>
                                            <Col span={8}>
                                                <div>
                                                    Số lượng: <b>{NumberUtil.toNumberMoney(size.quantity)}</b>
                                                </div>
                                            </Col>
                                            <Col span={8}>
                                                <div>
                                                    Số lượng nhập: <b>{NumberUtil.toNumberMoney(size.reQuantity)}</b>
                                                </div>
                                            </Col>
                                            <Col span={8}>
                                                <div>
                                                    Trọng lượng: <b>{NumberUtil.toNumberMoney(size.weight)}</b>
                                                </div>
                                            </Col>
                                            <Col span={8}>
                                                <div>
                                                    Giá bán (cộng thêm): <b>{NumberUtil.toNumberMoney(size.price)}</b>
                                                </div>
                                            </Col>
                                        </Row>
                                    )
                                } )
                            }
                            </Col>
                        </Row>
                    )
                } )
            }
        </Col>
      </Row>
    </div>
  );
}
