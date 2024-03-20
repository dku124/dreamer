import {Difference} from "@/@types/custom.type";
import {Product} from "@/@types/repo/product.type";
import {notiSelector} from "@/common/store/noti/noti.slice";
import {Col, Row} from "antd";
import {useForm} from "antd/es/form/Form";
import {useSelector} from "react-redux";

export function ProductUpdateModalNoti() {
  const noti = useSelector(notiSelector);
  const [form] = useForm();
  const getProduct1 = () => {
    if (noti.select) {
      const data = noti.select?.data[0] as Product;
      return data;
    }
  };
  const getProduct2 = () => {
    if (noti.select) {
      const data = noti.select?.data[1] as Product;
      return data;
    }
  };

  function compareObjects<T, U>(obj1: T, obj2: U): Difference<T, U> {
    const result: Partial<Difference<T, U>> = {};

    for (const key in obj1 as Object) {
      if ((obj1 as Object).hasOwnProperty(key)) {
        const value1 = obj1[key as keyof T];
        const value2 = obj2[key as keyof U];

        if (typeof value1 === "object" && typeof value2 === "object") {
          const nestedDiff = compareObjects(value1, value2) as any;
          // @ts ignore
          if (Object.keys(nestedDiff).length > 0) {
            result[key as keyof T] = nestedDiff;
          }
        } else if ((value1 as any) !== (value2 as any)) {
          (result[key as any as keyof T] as any) = value1;
        }
      }
    }

    return result as Difference<T, U>;
  }

  const compareData = () => {
    if (noti.select) {
      const data1 = noti.select?.data[0] as Record<string, any>;
      const data2 = noti.select?.data[1] as Record<string, any>;
      const diff = compareObjects(data1, data2);
      return diff;
    }
  };
  return (
    <div>
      <Row gutter={[32, 20]}>
        <Col span={12}>
          <h2>Thông tin trước cập nhập</h2>
          <Row gutter={[32, 20]}>
            <Col span={24}>
              <div>
                Tên sản phẩm: <b>{getProduct1()?.name}</b>
              </div>
            </Col>
            <Col span={12}>
              <div>
                Mã : <b>{getProduct1()?.code}</b>
              </div>
            </Col>
            <Col span={12}>
              <div>
                Link: <b>{getProduct1()?.link}</b>
              </div>
            </Col>
            <Col span={12}>
              <div>
                Đơn vị: <b>{getProduct1()?.unit.name}</b>
              </div>
            </Col>
            <Col span={12}>
              <div>
                Danh mục: <b>{getProduct1()?.category.name}</b>
              </div>
            </Col>
            <Col span={12}>
              <div>
                Kích thước:  Dài <b style={{}}>{getProduct1()?.size[0]}</b> <b>x</b>{" "}
                Rộng <b>{getProduct1()?.size[1]}</b>
              </div>
            </Col>
            <Col span={12}>
              <div>
                Bảo hành: <b style={{}}>{getProduct1()?.warrantyPeriod}</b>{" "}
                <b>{getProduct1()?.warrantyUnit}</b>
              </div>
            </Col>
            <Col span={24}>
              <div>
                Số lượng: <b>tối thiểu : </b>{" "}
                <b style={{}}>{getProduct1()?.inventory[0]}</b>
                {" - "} <b>tối đa : </b> <b>{getProduct1()?.inventory[1]}</b>
              </div>
            </Col>
           
            <Col span={24}>
              <div>
                Mô tả: <b style={{}}>{getProduct1()?.description}</b>
              </div>
            </Col>
          </Row>
        </Col>
        <Col
          span={12}
          style={{
            borderLeft: "1px solid black",
          }}
        >
          <h2>Thông tin sau cập nhập</h2>
          <Row gutter={[32, 20]}>
            <Col
              span={24}
              style={{
                color: compareData()?.name ? "red" : "black",
              }}
            >
              <div>
                Tên sản phẩm: <b>{getProduct2()?.name}</b>
              </div>
            </Col>
            <Col span={12} style={{
                color: compareData()?.code ? "red" : "black",
              }}>
              <div>
                Mã : <b>{getProduct2()?.code}</b>
              </div>
            </Col>
            <Col span={12} style={{
                color: compareData()?.link ? "red" : "black",
              }}>
              <div>
                Link: <b>{getProduct2()?.link}</b>
              </div>
            </Col>
            <Col span={12} style={{
                color: compareData()?.unit ? "red" : "black",
              }}>
              <div>
                Đơn vị: <b>{getProduct2()?.unit.name}</b>
              </div>
            </Col>
            <Col span={12} style={{
                color: compareData()?.category ? "red" : "black",
              }}>
              <div>
                Danh mục: <b>{getProduct2()?.category.name}</b>
              </div>
            </Col>
            <Col span={12} style={{
                color: compareData()?.size ? "red" : "black",
              }}>
              <div>
                Kích thước: <b style={{}}> Dài {getProduct2()?.size[0]}</b> <b>x</b>{" "}
                <b> Rộng {getProduct2()?.size[1]}</b>
              </div>
            </Col>
            <Col span={12} style={{
                color: compareData()?.warrantyPeriod||compareData()?.warrantyUnit ? "red" : "black",
              }}>
              <div>
                Bảo hành: <b style={{}}>{getProduct2()?.warrantyPeriod}</b>{" "}
                <b>{getProduct2()?.warrantyUnit}</b>
              </div>
            </Col>
            <Col span={24} style={{
                color: compareData()?.inventory ? "red" : "black",
              }}>
              <div>
                Số lượng: <b>tối thiểu : </b>{" "}
                <b style={{}}>{getProduct2()?.inventory[0]}</b>
                {" - "} <b>tối đa : </b> <b>{getProduct2()?.inventory[1]}</b>
              </div>
            </Col>
           
            <Col span={24} style={{
                color: compareData()?.description ? "red" : "black",
              }}>
              <div>
                Mô tả: <b style={{}}>{getProduct2()?.description}</b>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
