import './Setting.scss';
import type {TabsProps} from 'antd';
import {Tabs} from "antd";
import Config from "@pages/login/setting/config/Config.tsx";
import ConfigCamp from "@pages/login/setting/configCamp/ConfigCamp.tsx";
import ConfigUnit from "@pages/login/setting/configUnit/ConfigUnit.tsx";
import {ConfigOrder} from "@pages/login/setting/configOrder/configOrder.tsx";

export default function Setting() {
	const itemTabs :TabsProps['items']= [
		{
			key: 'configOrder',
			label: 'Cấu hình đơn hàng',
			children: <ConfigOrder/>
		},
		{
			key: 'config',
			label: 'Cấu hình chung',
			children: <Config/>,
			
		},
		{
			key: 'configCamp',
			label: 'Cấu hình chiến dịch',
			children: <ConfigCamp/>
		},
		{
			key: 'configUnit',
			label: 'Cấu hình đơn vị tiền',
			children: <ConfigUnit/>
		},
		
	]
	return (
		<div id={"Setting"}>
			<div className={"tabs"}>
				<Tabs
					defaultActiveKey="1"
					items={itemTabs}
					tabPosition={"left"}
					indicatorSize={(origin) => origin - 16}
				/>
			</div>
		</div>
	)
}