import { Difference } from "@/@types/custom.type";
import { SKU } from "@/@types/repo/sku.type";
import { notiSelector } from "@/common/store/noti/noti.slice";
import { DateUtil } from "@utils/date.util.tsx";
import { NumberUtil } from "@/common/utils/number.util";
import { Col, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect } from "react";
import { FaDotCircle } from "react-icons/fa";
import { useSelector } from "react-redux";

export function SkuUpdateModalNoti() {
  const noti = useSelector(notiSelector);
  const [form] = useForm();

  useEffect(() => {
    if (noti.select) {
      const data = noti.select?.data[0] as SKU;
      form.setFieldsValue({
        sku: data.code,
        address: data.importAddress,
        color: data.colors,
      });
    }
  }, [noti.select]);

  const getSku1 = () => {
    if (noti.select) {
      const data = noti.select?.data[0] as SKU;
      return data;
    }
  };
  const getSku2 = () => {
    if (noti.select) {
      const data = noti.select?.data[1] as SKU;
      return data;
    }
  };

  function compareObjects<T, U>(obj1: T, obj2: U): Difference<T, U> {
    const result: Partial<Difference<T, U>> = {};

    for (const key in obj1) {
      if ((obj1 as Object).hasOwnProperty(key)) {
        const value1 = obj1[key as any as keyof T];
        const value2 = obj2[key as any as keyof U];

        if (Array.isArray(value1) && Array.isArray(value2)) {
          if (value1.length !== value2.length) {
            result[key as keyof T] = value1 as any;
          } else {
            const arrayDiff = value1.map((item, index) =>
              compareObjects(item, value2[index]),
            );
            if (
              arrayDiff.some(
                (diff) => Object.keys(diff).length > 0,
              )
            ) {
              result[key as keyof T] = arrayDiff as any;
            }
          }
        }
        else if (
          typeof value1 === "object" &&
          typeof value2 === "object"
        ) {
          const nestedDiff = compareObjects(value1, value2);
          if (Object.keys(nestedDiff as any).length > 0) {
            result[key as keyof T] = nestedDiff as any;
          }
        }
        else { // @ts-ignore
          if ((value1 as any).toString().toUpperCase() !== value2.toString().toUpperCase()) {
            result[key as keyof T] = value1 as any;
          }
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
      console.log(diff)
      return diff;
    }
  };

  return (
    <div>
      <Row gutter={[32, 20]}>
        <Col span={12}>
          <h2>Thông tin trước cập nhập</h2>
          <Row gutter={[32, 20]}>
            <Col span={12}>
              <div>
                Mã SKU: <b>{getSku1()?.code}</b>
              </div>
            </Col>
            <Col span={12}>
              <div>
                Địa chỉ nhập: <b>{getSku1()?.importAddress}</b>
              </div>
            </Col>
            <Col span={12}>
              <div>
                Ngày nhập: <b>{DateUtil.format(getSku1()?.importDate)}</b>
              </div>
            </Col>
            {/*<Col span={12}>*/}
            {/*  <div>*/}
            {/*    Giá nhập :{" "}*/}
            {/*    <b>{NumberUtil.toNumberMoney(getSku1()?.importPrice)}</b>*/}
            {/*  </div>*/}
            {/*</Col>*/}
            <Col span={12}>
              <div>
                Giá bán (lẻ) :{" "}
                <b>{NumberUtil.toNumberMoney(getSku1()?.price)}</b>
              </div>
            </Col>
            <Col span={12}>
              <div>
                Giá bán (sỉ) :{" "}
                <b>{NumberUtil.toNumberMoney(getSku1()?.retailPrice)}</b>
              </div>
            </Col>
            <Col span={12}>
              <div>
                Nhà cung cấp : <b>{getSku1()?.supplier.name}</b>
              </div>
            </Col>
            <Col span={12}>
              <div>
                Hàng đã về kho : <b>{getSku1()?.state ? "Đã về" : "Chưa về"}</b>
              </div>
            </Col>
            <Col span={12}>
              <div>
                Ghi chú : <b>{getSku1()?.note}</b>
              </div>
            </Col>
            <Col span={24} style={{ paddingLeft: "15px" }}>
              {getSku1()?.colors.map((color, index) => {
                return (
                  <Row gutter={[32, 20]}>
                    <Col span={24}>
                      <div>
                        Màu: <b>{color.color}</b>
                      </div>
                    </Col>
                    <Col span={24}>
                      {color.sizes.map((size, index) => {
                        return (
                          <Row style={{ marginLeft: "30px" }} gutter={[10, 20]}>
                            <Col span={12}>
                              <div>
                                <FaDotCircle /> Size: <b>{size.size}</b>
                              </div>
                            </Col>
                            <Col span={12}>
                              <div>
                                Số lượng:{" "}
                                <b>{NumberUtil.toNumberMoney(size.quantity)}</b>
                              </div>
                            </Col>
                            <Col span={12}>
                              <div>
                                Số lượng nhập:{" "}
                                <b>
                                  {NumberUtil.toNumberMoney(size.reQuantity)}
                                </b>
                              </div>
                            </Col>
                            <Col span={12}>
                              <div>
                                Trọng lượng:{" "}
                                <b>{NumberUtil.toNumberMoney(size.weight)}</b>
                              </div>
                            </Col>
                            <Col span={12}>
                              <div>
                                Giá bán (cộng thêm):{" "}
                                <b>{NumberUtil.toNumberMoney(size.price)}</b>
                              </div>
                            </Col>
                            <Col span={12}>
                              <div>
                                Giá nhập:{" "}
                                <b>{NumberUtil.toNumberMoney(size.importPrice)}</b>
                              </div>
                            </Col>
                          </Row>
                        );
                      })}
                    </Col>
                  </Row>
                );
              })}
            </Col>
          </Row>
        </Col>
        <Col span={12} style={{
          borderLeft: "1px solid  ",
        }}>
          <h2>Thông tin sau cập nhập</h2>
          <Row gutter={[32, 20]}>
            <Col
              span={12}
              style={{
                color: compareData()?.code ? "red" : " ",
              }}
            >
              <div>
                Mã SKU: <b>{getSku2()?.code}</b>
              </div>
            </Col>
            <Col
              span={12}
              style={{
                color: compareData()?.importAddress ? "red" : " ",
              }}
            >
              <div>
                Địa chỉ nhập: <b>{getSku2()?.importAddress}</b>
              </div>
            </Col>
            <Col
              span={12}
              style={{
                color: compareData()?.importDate ? "red" : " ",
              }}
            >
              <div>
                Ngày nhập: <b>{DateUtil.format(getSku2()?.importDate)}</b>
              </div>
            </Col>
            {/*<Col*/}
            {/*  span={12}*/}
            {/*  style={{*/}
            {/*    color: compareData()?.importPrice ? "red" : " ",*/}
            {/*  }}*/}
            {/*>*/}
            {/*</Col>*/}
            <Col
              span={12}
              style={{
                color: compareData()?.price ? "red" : "",
              }}
            >
              <div>
                Giá bán (lẻ) :{" "}
                <b>{NumberUtil.toNumberMoney(getSku2()?.price)}</b>
              </div>
            </Col>
            <Col
              span={12}
              style={{
                color: compareData()?.retailPrice ? "red" : "",
              }}
            >
              <div>
                Giá bán (sỉ) :{" "}
                <b>{NumberUtil.toNumberMoney(getSku2()?.retailPrice)}</b>
              </div>
            </Col>
            <Col
              span={12}
              style={{
                color: compareData()?.supplier?.name ? "red" : " ",
              }}
            >
              <div>
                Nhà cung cấp : <b>{getSku2()?.supplier.name}</b>
              </div>
            </Col>
            <Col
              span={12}
              style={{
                color: compareData()?.state ? "red" : " ",
              }}
            >
              <div>
                Hàng đã về kho : <b>{getSku2()?.state ? "Đã về" : "Chưa về"}</b>
              </div>
            </Col>
            <Col
              span={12}
              style={{
                color: compareData()?.note ? "red" : " ",
              }}
            >
              <div>
                Ghi chú : <b>{getSku2()?.note}</b>
              </div>
            </Col>
            <Col span={24} style={{ paddingLeft: "15px" }}>
              {getSku2()?.colors.map((color, index) => {
                let colorZise
                console.log(compareData()?.colors)
                if (compareData()?.colors) {
                  colorZise = "red";
                }
                return (
                  <Row gutter={[32, 20]}>

                    <Col span={24} style={{
                      color: colorZise || " ",
                    }}>
                      <div>
                        Màu: <b>{color.color}</b>
                      </div>
                    </Col>
                    <Col span={24} >
                      {color?.sizes.map((size, index) => {
                        let colorZises = ""
                        let quantity = ""
                        let reQuantity = ""
                        let weight = ""
                        let price = ""
                        let importPrice = ""
                        if (compareData()?.colors && compareData()?.colors[index]?.color) {
                          if (compareData()?.colors[index]?.sizes[index]) {
                            if (compareData()?.colors[index]?.sizes[0]?.size) {
                              colorZises = "red";
                            }
                            if (compareData()?.colors[index]?.sizes[0]?.quantity) {
                              quantity = "red";
                            }
                            if (compareData()?.colors[index]?.sizes[0]?.reQuantity) {
                              reQuantity = "red";
                            }
                            if (compareData()?.colors[index]?.sizes[0]?.weight) {
                              weight = "red";
                            }
                            if (compareData()?.colors[index]?.sizes[0]?.price) {
                              price = "red";
                            }
                            if (compareData()?.colors[index]?.sizes[0]?.importPrice) {
                              importPrice = "red";
                            }
                          }
                        }
                        return (
                          <Row style={{ marginLeft: "30px" }} gutter={[10, 20]}>
                            <Col span={12} style={{
                              color: colorZises,
                            }}>
                              <div>
                                <FaDotCircle /> Size: <b>{size.size}</b>
                              </div>
                            </Col>
                            <Col span={12} style={{
                              color: quantity,
                            }}>
                              <div>
                                Số lượng:{" "}
                                <b>{NumberUtil.toNumberMoney(size.quantity)}</b>
                              </div>
                            </Col>
                            <Col span={12} style={{
                              color: reQuantity,
                            }}>
                              <div>
                                Số lượng nhập:{" "}
                                <b>
                                  {NumberUtil.toNumberMoney(size.reQuantity)}
                                </b>
                              </div>
                            </Col>
                            <Col span={12} style={{
                              color: weight,
                            }}>
                              <div>
                                Trọng lượng:{" "}
                                <b>{NumberUtil.toNumberMoney(size.weight)}</b>
                              </div>
                            </Col>
                            <Col span={12} style={{
                              color: price,
                            }}>
                              <div>
                                Giá bán (cộng thêm):{" "}
                                <b>{NumberUtil.toNumberMoney(size.price)}</b>
                              </div>
                            </Col>
                            <Col span={12} style={{
                              color: importPrice,
                            }}>
                              <div>
                                Giá nhập :{" "}
                                <b>{NumberUtil.toNumberMoney(size.importPrice)}</b>
                              </div>
                            </Col>
                          </Row>
                        );
                      })}
                    </Col>
                  </Row>
                );
              })}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
