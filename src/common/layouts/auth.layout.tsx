import {Outlet} from "react-router";
import {ConfigProvider, Layout, theme} from "antd";
import './layout.scss';
import {useSelector} from "react-redux";
import {configSelector} from "@store/config/config.slice.ts";
import viVN from "antd/lib/locale/vi_VN";

const {  Content } = Layout;

export function AuthLayout() {
	const config = useSelector(configSelector)
    return (
        <div id={"authLayout"} >
            <Layout>
                <Content id={"layoutContent"}>
					<ConfigProvider
						locale={viVN}
					theme={{
						algorithm: config.darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
					}}
					
					>
						<Outlet />
					</ConfigProvider>
                    
                </Content>
            </Layout>
        </div>
    )
}
