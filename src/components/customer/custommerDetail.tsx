import {Tabs, TabsProps} from "antd";
import CustomerAddOnInfo from "@components/customer/CustomerAddOnInfo.tsx";
import CustomerHistoryOrderTable from "@components/customer/CustomerHistoryOrderTable.tsx";

export default function CustomerDetail()
{
	const items: TabsProps['items'] = [
		{ key: 'info', label: 'Thông tin', children: <CustomerAddOnInfo/> },
		{ key: 'orders', label: 'Lịch sử bán hàng', children: <CustomerHistoryOrderTable/> },
	];
	return (
		<Tabs
			type="card"
			defaultActiveKey="1"
			items={items}
			
		/>
	)
}