import {useDispatch, useSelector} from "react-redux";
import {useQuery} from "@hooks/page.hook.ts";
import {AppDispatch} from "@store/store.ts";
import {useEffect, useState} from "react";
import {Button, Input, Select, Space, Table, Tooltip} from "antd";
import {IoReload} from "react-icons/io5";
import {customerSelector, setCustomerSelect} from "@/common/store/customer/customer.slice";
import CustomerThunk from "@/common/store/customer/customer.thunk";
import {Customer} from "@/@types/repo/customer.type";
import {NumberUtil} from "@/common/utils/number.util";
import {OnselectRow} from "@/common/utils/method.utils";
import Pagination from "@/components/pagination/paginationx";
import {CustomerHelper} from "@/common/helpers/customer.helper";
import CustomerDetailsModal from "@/modals/customer/customer.detail";
import {ShipHelper} from "@/common/helpers/ship.helper.tsx";
import {OrderHelper} from "@/common/helpers/order.helper.tsx";
import UserThunk from "@store/user/user.thunk.ts";
import {UserRole} from "@/@types/user.type.ts";
import {UserHelper} from "@/common/helpers/user.helper.tsx";
import {userSelector} from "@store/user/user.slice.ts";
import CustomerDetail from "@components/customer/custommerDetail.tsx";

export default function CustomerManager() {
	const customer = useSelector(customerSelector)
	const user = useSelector(userSelector)
	const [query,setQuery] = useQuery()
	const [selectId, setSelectId] = useState<string[]>([])
	const dispatch = useDispatch<AppDispatch>()
	const [configModal,setConfigModal] = useState<Record<string, boolean>>({
		update: false,
	})
	useEffect(() =>{
		dispatch(CustomerThunk.getPage(query))
		dispatch(UserThunk.getUserByRole([UserRole.LEADER,UserRole.TELE_SALE,UserRole.LEADER]))
	}, [query])

	const toggleModal = (modal:string) => {
		return () => {
			setConfigModal({...configModal,[modal]:!configModal[modal]})
		}
	}
    const selectCustomer = (customer:Customer) => {
		dispatch(setCustomerSelect(customer))
		selectRow(customer)
	}
	
	const selectRow = (record:Customer) => {
		if (selectId.includes(record._id)) {
			setSelectId(selectId.filter((item:string) => item !== record._id))
		} else {
			setSelectId([...selectId, record._id])
		}
	}
	
	return (
		<div id={`CustomerManager`}>
			{
				configModal.update && <CustomerDetailsModal open={configModal.update} onCancel={toggleModal("update")} />
			}
			<div className={"header-control"}>
				<div>
					<Tooltip title={"Tải lại"}>
						<Button className={"btn"} shape={"circle"}
								type={"primary"} icon={<IoReload />}
								onClick={e=>setQuery({...query})}
						/>
					</Tooltip>
				</div>
				<div>
					<Space.Compact>
						<Select placeholder={"Người chốt"} allowClear={true} style={{minWidth:"180px"}}
								options={UserHelper.toListUser(user?.list || [])}
								
								onSelect={e=>setQuery({userConfirm:e,page:1})}
								onClear={()=>setQuery({userConfirm:undefined,page:1})}
						/>
						<Select placeholder={"Trạng thái đơn"} 
								
								style={{minWidth:"180px"}} allowClear={true} options={OrderHelper.toOrderStatusOptions()}
								onSelect={e=>setQuery({orderStatus:e,page:1})}
								onClear={()=>setQuery({orderStatus:undefined,page:1}) }
								
						/>
						<Select placeholder={"Trạng thái vận chuyển"} style={{minWidth:"180px"}} allowClear={true}
								onSelect={e=>setQuery({shipStatus:e,page:1})}
								onClear={()=>setQuery({shipStatus:undefined,page:1})}
								options={ShipHelper.toLabelStatus()}/>
						<Select placeholder={"Đơn vị vận chuyển"} allowClear={true} style={{minWidth:"180px"}}
								onSelect={e=>setQuery({shipType:e,page:1})}
								onClear={()=>setQuery({shipType:undefined,page:1})}
								options={ShipHelper.toType()}/>
						<Select placeholder={"Tỉnh thành"} allowClear={true} style={{minWidth:"250px"}} showSearch={true}
								options={ShipHelper.toProviderList()}
								onSelect={e=>setQuery({province:e,page:1})}
								onClear={()=>setQuery({province:undefined,page:1})}
								filterOption={(input, option) =>{
									// @ts-ignore
									return option?.raw?.toLowerCase().indexOf(input.toLowerCase()) >= 0
								}}
						>
						</Select>
						<Input.Search
							allowClear  className={"input-search"}
							placeholder={"Tìm kiếm"} width={"300px"}
							onSearch={e=>setQuery({query:e,page:1})} enterButton
						/>
					</Space.Compact>
					
				</div>
			</div>
            <div className={"body-control"}>
				<Table pagination={false} rowKey={"_id"} dataSource={customer?.data?.data || []}
					   onRow={(record:Customer) => OnselectRow(record,selectCustomer)}
					   loading={customer.loading}
					   expandable={{
						   expandedRowKeys:selectId,
						   expandedRowRender: (record:Customer,index: number, indent: number, expanded: boolean) => {
								return expanded ? <CustomerDetail /> : null	
						   },
						   rowExpandable: record => true,
					   }}
				>
					<Table.Column title={"STT"} align="center" render={NumberUtil.toIndex} />
					<Table.Column title={"Tên khách hàng"} width={250} dataIndex={"fullName"} />
					<Table.Column title={"Số điện thoại"} width={150} align="center" dataIndex={"phone"} />
                    <Table.Column title={"Địa chỉ"} dataIndex={"address"} />
                    <Table.Column title={"Tổng SP"} width={100} align="center" render={CustomerHelper.totalProductBuy} />
                    <Table.Column title={"Tổng tiền"} width={150} align="center" render={CustomerHelper.totalMoney}/>
					<Table.Column title={"Tỉ lệ nhận"} width={150} align="center" render={CustomerHelper.rateReceive}/>
					<Table.Column title={"Tỉ lệ hủy"} width={150} align="center" render={CustomerHelper.rateCancel}/>
                    {/*<Table.Column title={"Sản phẩm đã mua"}  render={CustomerHelper.productBuy}/>*/}
					{/*<Table.Column title={"Hành động"} render={(text,record:Customer) => (*/}
					{/*	<Space.Compact>*/}
					{/*		<Tooltip title={"Cập nhật thông tin khách hàng"}>*/}
					{/*			<Button className={"btn"} type={"primary"}*/}
					{/*					onClick={toggleModal("update")}*/}
					{/*			>*/}
					{/*				Chi tiết*/}
					{/*			</Button>*/}
					{/*		</Tooltip>*/}
					{/*	</Space.Compact>*/}
					{/*)} />*/}
				</Table>
				<Pagination query={query} onChange={setQuery} page={customer.data}/>
			</div>
		</div>
	)
}