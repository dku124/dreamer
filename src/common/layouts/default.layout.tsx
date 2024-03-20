import React, {useEffect, useState} from 'react';
import {MenuFoldOutlined, MenuUnfoldOutlined,} from '@ant-design/icons';
import {Breadcrumb, Button, ConfigProvider, Dropdown, Layout, MenuProps, theme, Typography} from 'antd';
import logo from '@assets/images/logo.png'
import './layout.scss'
import {useDispatch, useSelector} from "react-redux";
import {configSelector, setCollapsed, setDarkMode} from "@store/config/config.slice.ts";
import {Outlet, useLocation, useNavigate} from "react-router";
import {FaCloudMoon, FaCloudSun, FaRegUserCircle, FaUserCircle} from "react-icons/fa";
import {IoMdLogOut} from "react-icons/io";
import {MainMenu} from "@components/menu/MainMenu.tsx";
import {logout} from '../store/auth/auth.slice';
import {UserInfoModal} from '@/modals/auth/userInfo.modal';
import {AppDispatch} from '../store/store';
import {AuthThunk} from '@/common/store/auth/auth.thunk';
import {ListNoti} from '@/components/noti/ListNoti';
import socket from "@providers/Socket.ts";
import viVN from "antd/lib/locale/vi_VN";

const { Header, Sider, Content } = Layout;


export function DefaultLayout() {
    const navigate = useNavigate();
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const config = useSelector(configSelector)
	const [configModal, setConfigModal] = useState({
		userInfo: false,
	});
    const dispatch = useDispatch<AppDispatch>()
	const locationPath = useLocation();
    const logoutUser = () => {
        dispatch(logout())
		navigate('/')
    };

	useEffect(() => {
		dispatch(AuthThunk.me())
		socket.connect()
		return () => {
			socket.disconnect()
		}
	}, []);


    const items:MenuProps['items'] = [
        {
            key: 'info',
            label: <Button type={"link"}>Thông tin cá nhân</Button>,
            icon: <FaRegUserCircle size={25} />,
            onClick: () => {
				setConfigModal({...configModal,userInfo:true})
			},
        },
        {
            key: 'logout',
            label: <Button danger type={"link"}>Đăng xuất</Button>,
            icon: <IoMdLogOut size={25} />,
            onClick: logoutUser,
        }
    ]

	const getBreadcrumb = () => {
		const defaultBreadcrumb = [
			{
				title: <Typography>Trang Chủ</Typography>,
			},
		]
		if(config.breadcrumb.length !== 0 && locationPath.pathname !== "dashboard")
		{
			let temp = "";
			for (let i = 0; i < config.breadcrumb.length; i++) {
				const item = config.breadcrumb[i];
				temp +="/" +item?.key;
				if(item?.label)
				{
					defaultBreadcrumb.push({
						title: <Typography>{item.label}</Typography>
					})
				}
				
			}
		}
		return defaultBreadcrumb;
	}


	useEffect(() => {
		if(config.darkMode)
		{
			document.body.classList.add('dark-mode')
		}
		else
		{
			document.body.classList.remove('dark-mode')
		}
	}, [config.darkMode]);
	
	
    // @ts-ignore
	return (
		<ConfigProvider
			locale={viVN}
			theme={{
				algorithm: config.darkMode ? [theme.darkAlgorithm] : [theme.defaultAlgorithm],
			}}

		>
			<Layout id={"DefaultLayout"}>
				<UserInfoModal title="Thông tin tài khoản" open={configModal.userInfo} onCancel={()=> setConfigModal({...configModal,userInfo:false})} />
				<Sider theme={"light"} width={250} trigger={null} collapsible collapsed={config.isCollapsed} style={{
					position: 'fixed',
					height: '100vh',
					left: 0,
					zIndex: 1000,
				}}>
					<div className="demo-logo-vertical" >
						<img alt={"logo"} src={logo} width={"100%"}/>
					</div>
					<MainMenu/>
				</Sider>
				<Layout>
					<Header 
						className={"main-header"}
						style={{
						position: 'fixed',
						zIndex: 1000,
						width: '100%',
						//marginLeft: config.isCollapsed ? 80 : 250,
						height: "64px",
						padding: 0 }}>
						<div className={"main-menu-header"}>
							<div style={{margin:0}}>
								<Button
									type="text"
									icon={config.isCollapsed ? <MenuUnfoldOutlined size={25} /> : <MenuFoldOutlined size={25} />}
									onClick={() => dispatch(setCollapsed(!config.isCollapsed))}
									style={{
										fontSize: '16px',
										width: "64px",
										height: "64px",
										margin:0
									}}
								/>
							</div>
							<div style={{height:"64px",display:"flex",alignItems:'center'}}>
								<Typography.Title className='content-title' level={4}>{config.select}</Typography.Title>
							</div>
							<div style={{display: "flex"}}>
								<ListNoti/>
								<div >

									<Button
										type="text"
										onClick={()=> dispatch(setDarkMode(!config.darkMode))}
										icon={config.darkMode ? <FaCloudSun size={25} /> : <FaCloudMoon size={25} />}
										style={{
											fontSize: '16px',
											width: 64,
											height: 64,
										}}
									/>
								</div>
								<div>
									<Dropdown menu={{items}} placement="bottomLeft" arrow>
										<Button
											type="text"
											icon={<FaUserCircle size={25}/>}
											style={{
												fontSize: '16px',
												width: 64,
												height: 64,
											}}
										/>
									</Dropdown>
								</div>
							</div>
						</div>
					</Header>
					<Breadcrumb
						className={"main-breadcrumb"}
						items={getBreadcrumb()}
						style={{
							marginTop: 64,
							marginLeft: config.isCollapsed ? 80 : 250,
							padding: 10,

						}}
					/>
					<Content
						className={"main-content-body"}
						style={{

							marginLeft: config.isCollapsed ? 80 : 250,
							padding: 30,
							minHeight: '100vh',

						}}
						// style={{
						//     background: colorBgContainer,
						// }}
					>
						<Outlet/>
					</Content>
				</Layout>
			</Layout>
		</ConfigProvider>
    );
}
