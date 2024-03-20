// import { Difference } from "@/@types/custom.type";
import {Supplier} from "@/@types/repo/supplier.type";
import {notiSelector} from "@/common/store/noti/noti.slice";
import {Col, Row} from "antd";
import {useForm} from "antd/es/form/Form";
import {useSelector} from "react-redux";

type ValueOf<T> = T[keyof T];

type ArrayItem<T> = T extends (infer U)[] ? U : never;

type Difference<T, U> = T extends U
  ? {
      [K in keyof T]: K extends keyof U
        ? T[K] extends Array<any>
          ? U[K] extends Array<any>
            ? ArrayItem<T[K]> extends object
              ? ArrayItem<U[K]> extends object
                ? Difference<ArrayItem<T[K]>, ArrayItem<U[K]>>[]
                : ArrayItem<T[K]> | ArrayItem<U[K]> | undefined
              : T[K] | U[K] | undefined
            : T[K] | U[K] | undefined
          : Difference<T[K], U[K]>
        : T[K];
    }
  : T;

export function SupplierUpdateModalNoti() {
	const noti = useSelector(notiSelector);
	const [form] = useForm();
	const getSku1 = () => {
		if (noti.select) {
			const data = noti.select?.data[0] as Supplier;
			return data;
		}
	};
	const getSku2 = () => {
		if (noti.select) {
			const data = noti.select?.data[1] as Supplier;
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
				} else if (
					typeof value1 === "object" &&
					typeof value2 === "object"
				) {
					const nestedDiff = compareObjects(value1, value2);
					if (Object.keys(nestedDiff as any).length > 0) {
						result[key as keyof T] = nestedDiff as any;
					}
				} else if ((value1 as any) !== value2) {
					result[key as keyof T] = value1 as any;
				}
			}
		}
		return result as Difference<T, U>;
	}

	// function compareObjects<T, U>(obj1: T, obj2: U): Difference<T, U> {
	//   const result: Partial<Difference<T, U>> = {};

	//   for (const key in obj1) {
	//     if ((obj1 as Object).hasOwnProperty(key)) {
	//       const value1 = obj1[key as any as keyof T];
	//       const value2 = obj2[key as any as keyof U];

	//       if (Array.isArray(value1) && Array.isArray(value2)) {
	//         if (value1.length !== value2.length) {
	//           result[key as any as keyof T] = value1 as any;
	//         } else {
	//           const arrayDiff = value1.map((item, index) =>
	//             compareObjects(item, value2[index])
	//           );
	//           if (arrayDiff.some((diff) => Object.keys(diff).length > 0)) {
	//             result[key as any as keyof T] = arrayDiff as any;
	//           }
	//         }
	//         const arrayDiff = value1.map((item, index) =>
	//           compareObjects(item, value2[index])
	//         );
	//         if (arrayDiff.some((diff) => Object.keys(diff).length > 0)) {
	//           result[key as any as keyof T] = arrayDiff as any;
	//         }
	//       } else if (typeof value1 === "object" && typeof value2 === "object") {
	//         const nestedDiff = compareObjects(value1, value2);
	//         if (Object.keys(nestedDiff as any).length > 0) {
	//           result[key as any as keyof T] = nestedDiff as any;
	//         }
	//       } else if ((value1 as any) !== value2) {
	//         result[key as any as keyof T] = value1 as any;
	//       }
	//     }
	//   }

	//   return result as Difference<T, U>;
	// }

	const compareData = () => {
		if (noti.select) {
			const data1 = noti.select?.data[0] as Record<string, any>;
			const data2 = noti.select?.data[1] as Record<string, any>;
			console.log('data1',data1,"data2",data2)
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
								Tên nhà cung cấp: <b>{getSku1()?.name}</b>
							</div>
						</Col>
						<Col span={24}>
							<div>
								Tên Ngắn gọn: <b>{getSku1()?.shortName}</b>
							</div>
						</Col>
						<Col span={24}>
							<Row gutter={[32, 20]}>
								{getSku1()?.phones.map((item, index) => {
									return (
										<Col span={24} key={index}>
											<div>
												Số điện thoại: <b>{item}</b>
											</div>
										</Col>
									);
								})}
							</Row>
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
								Tên nhà cung cấp: <b>{getSku2()?.name}</b>
							</div>
						</Col>
						<Col
							span={24}
							style={{
								color: compareData()?.shortName
									? "red"
									: "black",
							}}
						>
							<div>
								Tên Ngắn gọn: <b>{getSku2()?.shortName}</b>
							</div>
						</Col>
						<Col span={24}>
							<Row gutter={[32, 20]}>
								{getSku2()?.phones.map((item, index) => {
									return (
										<Col
											span={24}
											key={index}
											style={{
												color: compareData()?.phones
													? "red"
													: "black",
											}}
										>
											<div>
												Số điện thoại: <b>{item}</b>
											</div>
										</Col>
									);
								})}
							</Row>
						</Col>
					</Row>
				</Col>
			</Row>
		</div>
	);
}
