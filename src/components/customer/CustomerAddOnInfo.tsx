import {Button, Col, Divider, Image, Row, Space, Typography} from "antd";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {customerSelector} from "@store/customer/customer.slice.ts";
import empty from "@/assets/images/empty.png"
import {CustomerUpdateInfoModal} from "@components/customer/CustomerUpdateInfo.tsx";
import {AppDispatch} from "@store/store.ts";
import CustomerThunk from "@store/customer/customer.thunk.ts";
import {CustomerHelper} from "@/common/helpers/customer.helper.tsx";
import {CustomerUpdateNoteModal} from "@components/customer/CustomerNote.tsx";

export default function CustomerAddOnInfo() {
	const customer = useSelector(customerSelector)
	const dispatch = useDispatch<AppDispatch>()
	const [configModal,setConfigModal] = useState<Record<string, boolean>>({
		update: false,
		note: false
	})
	const ref = React.useRef<HTMLInputElement>(null)
	const RowData =(key:string|undefined,value:string|React.ReactNode,index:number) => {
		return (
			<div key={index}>
				<Row>
					<Col span={8}>
						<Typography.Text strong>{key}</Typography.Text>
					</Col>
					<Col span={16}>
						<Typography.Text>{value}</Typography.Text>
					</Col>
				</Row>
				<Divider style={{margin:"6px 0"}}/>
			</div>
		)
	}

	useEffect(() => {
		if (ref.current)
		{
			ref.current.onchange = (e) => {
				const file = (e.target as HTMLInputElement).files?.[0];
				dispatch(CustomerThunk.uploadImg({
					id:customer.select?._id,
					file:file
				}));
			}
		}
	}, [ref]);
	
	const toggleModal = (modal:string) => {
		return () => {
			setConfigModal({...configModal,[modal]:!configModal[modal]})
		}
	}
  return (
	  <div>
		  {configModal.update && <CustomerUpdateInfoModal open={configModal.update} onCancel={toggleModal("update")} /> }
		  {configModal.note && <CustomerUpdateNoteModal open={configModal.note} onCancel={toggleModal("note")} /> }
		  <input ref={ref} type={"file"} className={"hidden"}/>
		  <Row gutter={[32,16]}>
			  <Col span={3}>
				  <Image
					  width={150}
					  src={customer?.select?.addOnInfo?.img ? CustomerHelper.uploadPath(customer?.select) : empty}
				  />
			  </Col>
			  <Col span={7}>
				  {
					  [
						  ["Tên khách hàng",customer?.select?.fullName],
						  ["Số điện thoại",customer?.select?.phone],
						  ["Địa chỉ",customer?.select?.address],
						  ["Giới tính",customer?.select?.addOnInfo?.gender != undefined ? customer?.select?.addOnInfo?.gender == 0 ? "Nam" : "Nữ" : ""],
						  ["Ngày sinh",customer?.select?.addOnInfo?.dateOfBirth || ""]
					  ].map((item,index) => RowData(item[0],item[1],index))
				  }
			  </Col>
			  <Col span={7} style={{borderRight:"1px solid #ccc"}}>
				  {
					  [
						  ["Facebook",customer?.select?.addOnInfo?.fb || ""],
						  ["Email",customer?.select?.addOnInfo?.email || ""],
						  ["Nhóm KH",customer?.select?.addOnInfo?.type != undefined ? customer?.select?.addOnInfo?.type == 0 ? "Cá nhân" : "Doanh nghiệp" : ""],
					  ].map((item,index) => RowData(item[0],item[1],index))
				  }
			  </Col>
			  <Col span={7}>
				  <Row style={{height:"100%"}} justify={"space-around"}>
					  <Col span={24} style={{height:"calc(100% - 40px)"}}>
						  <Typography.Text strong>Ghi chú :</Typography.Text>
						  <div>
							  <Typography.Text>{customer?.select?.addOnInfo?.note}</Typography.Text>
						  </div>
					  </Col>
					  <Col span={24} style={{height:"40px"}}>
						  <Space.Compact>
							  <Button type={"primary"} onClick={toggleModal("update")}>Cập nhật</Button>
							  <Button type={"primary"}
							  onClick={() => {
								  if(ref.current) ref.current.click()
							  }}
							  >Cập nhật ảnh</Button>
							  <Button onClick={toggleModal("note")} type={"primary"}>Ghi chú</Button>
						  </Space.Compact>
					  </Col>
				  </Row>
			  </Col>
		  </Row>
	  </div>
  );
}