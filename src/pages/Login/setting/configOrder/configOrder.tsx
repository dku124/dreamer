import {Button, Col, Row, Table} from "antd";
import {NumberUtil} from "@utils/number.util.ts";
import {userSelector} from "@store/user/user.slice.ts";
import {useDispatch, useSelector} from "react-redux";
import {orderSelector} from "@store/order/order.slice.ts";
import React, {useEffect, useState} from "react";
import {AppDispatch} from "@store/store.ts";
import UserThunk from "@store/user/user.thunk.ts";
import {User, UserRole} from "@/@types/user.type.ts";
import OrderThunk from "@store/order/order.thunk.ts";
import {Shipping} from "@/@types/order/ship.type.ts";
import {OrderHelper} from "@/common/helpers/order.helper.tsx";
import "../Setting.scss"

export function ConfigOrder()
{
	const user = useSelector(userSelector)
	const order = useSelector(orderSelector)
	const [listSale, setListSale] = useState<string[]>([])
	const dispatch = useDispatch<AppDispatch>()
	useEffect(() => {
		dispatch(UserThunk.getUserByRole([UserRole.TELE_SALE]))
		dispatch(OrderThunk.getOrderRaw())
	}, []);
	
	const selectSale = (rowIds:React.Key[]) => {
		setListSale(rowIds.map((id:React.Key) => id.toString()))
	}
	
	const splitOrder = () => {
		if (listSale.length>0)
		{
			dispatch(OrderThunk.splitOrderForSale(listSale))
		}
	}
	
	
	return (
		<div id={"ConfigOrder"}>
			<Row gutter={32}>
				<Col span={16}>
					<div className={"table"}>
						<Table
							loading={order.loadings.getOrderRaw}
							rowKey={"_id"}
							pagination={false}
							dataSource={order.list}
							scroll={{y: 1000}}
						>
							<Table.Column title={"STT"} align={"center"} width={80} render={NumberUtil.toIndex} />
							<Table.Column title={"Tên khách"} dataIndex={"ship"} render={(ship:Shipping)=>ship.to.fullName} />
							<Table.Column title={"Số điện thoại"} dataIndex={"ship"} render={(ship:Shipping)=>ship.to.phone} />
							<Table.Column title={"Sản phẩm"} dataIndex={"details"} render={OrderHelper.ToProduct} />
						</Table>
					</div>
				</Col>
				<Col span={8}>
					<div className={"sales"}>
						<Table dataSource={user.list} pagination={false}
							rowKey={"_id"}
							   loading={user.loadings.list}
						   rowSelection={{
							   type:"checkbox", 
							   onChange:selectSale,
							   selectedRowKeys:listSale,
							   
						   }} 
							   onRow={(record:User) => {
								   return {
									   onClick: () => {
										   if (listSale.includes(record._id))
										   {
											   setListSale(listSale.filter((id:string) => id!==record._id))
										   }
										   else {
											   setListSale([...listSale, record._id])
										   }
									   }
								   }
							   }}
						>
							<Table.Column title={"STT"} align={"center"} width={50} render={NumberUtil.toIndex} />
							<Table.Column title={"Tên sale"} dataIndex={"fullName"} />
						</Table>
					</div> 
					<div className={"setting-btn"}>
						<Button type={"primary"} disabled={user.loadings.list} block={true} onClick={splitOrder} loading={order.loading}>Chia đơn</Button>
					</div>
				</Col>
			</Row>
		</div>
	)
}