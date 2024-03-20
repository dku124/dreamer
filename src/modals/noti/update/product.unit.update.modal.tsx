import {Difference} from "@/@types/custom.type";
import {ProductUnit} from "@/@types/repo/product-unit.type";
import {notiSelector} from "@/common/store/noti/noti.slice";
import {Col, Row} from "antd";
import {useForm} from "antd/es/form/Form";
import {useSelector} from "react-redux";

export function ProductUnitUpdateModalNoti() {
  const noti = useSelector(notiSelector);
  const [form] = useForm();
  const getSku1 = () => {
    if (noti.select) {
      const data = noti.select?.data[0] as ProductUnit;
      return data;
    }
  };
  const getSku2 = () => {
    if (noti.select) {
      const data = noti.select?.data[1] as ProductUnit;
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
                Tên đơn vị: <b>{getSku1()?.name}</b>
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
                Tên đơn vị: <b>{getSku2()?.name}</b>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
