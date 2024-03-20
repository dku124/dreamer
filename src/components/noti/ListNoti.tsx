import NoticeIcon from 'ant-design-pro/lib/NoticeIcon';
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {clearNoti, notiSelector, readRole, selectNoti} from "@store/noti/noti.slice.ts";
import {RoleHelper} from "@/common/helpers/role.helper.tsx";
import {UserRole} from "@/@types/user.type.ts";
import {NotiHelper} from "@/common/helpers/noti.helper.tsx";
import {authSelector} from "@store/auth/auth.slice.ts";
import {StringUtil} from "@utils/string.util.ts";
import socket from "@providers/Socket.ts";
import {AppDispatch} from "@store/store.ts";
import {NotiModal} from '@/modals/noti/noti.modal';
import {HiOutlineBellAlert} from "react-icons/hi2";
import {configSelector} from "@store/config/config.slice.ts";
import {Badge, Button} from "antd";

export function ListNoti()
{
	const noti = useSelector(notiSelector);
	const auth = useSelector(authSelector);
	const [popupVisible, setPopupVisible] = React.useState(false);
	const dispatch = useDispatch<AppDispatch>()
	const configx = useSelector(configSelector)
	const [config,setConfig] = React.useState({
		open: false,
	})
	const toggleModal = () => {

		setConfig({
			...config,
			open: !config.open
		})
		
	}

	const onCanCel = () => {
		setConfig({
			...config,
			open: !config.open
		})
		dispatch(clearNoti())
		if (popupVisible)
		{
			// @ts-ignore
			document.querySelector("body").style.overflow = "hidden"
		}
		else
		{
			// @ts-ignore
			document.querySelector("body").style.overflow = "auto"
		}
	}


	// @ts-ignore
	return (
		// @ts-ignore
		<div style={{
			
		}}>
			{
				config.open && <NotiModal open={config.open} onCancel={onCanCel}/>
			}
			{/* @ts-ignore */}
			<NoticeIcon
				
				popupVisible={popupVisible}
				bell={
				
				<Button type={"text"}
						style={{
							fontSize: '16px',
							width: "64px",
							height: "64px",
							margin:0
						}}
						icon={
							<Badge count={noti.totalUnread}>
								<HiOutlineBellAlert size={25} color={configx.darkMode ? "#fff":"#000"} />
							</Badge>
					}
						onClick={()=> setPopupVisible(true)}/>
					
				}
				onItemClick={(item:any, tabProps) => {
					dispatch(selectNoti(item.entity))
					toggleModal()
					setPopupVisible(false)
				}}
				
				onTabChange={(key) => {
					const index = StringUtil.GetDataByRegex(key, /\.\$(\d+)/, 1);
					socket.emit("readNoti",{
						role: auth.user?.roles[index.toNumber()] || UserRole.ADMIN,
					})
					dispatch(readRole(auth.user?.roles[index.toNumber()] || UserRole.ADMIN))
				
				}}
				onPopupVisibleChange={(visible) => {
					setPopupVisible(visible)
					if (visible)
					{
						// @ts-ignore
						document.querySelector("body").style.overflow = "hidden"
					}
					else
					{
						// @ts-ignore
						document.querySelector("body").style.overflow = "auto"
					}
					
					
				}}
				locale={{
					viewMore: "Xem thêm",
					emptyText: "Không có thông báo",
					clear: "Xóa",
				}}
				onViewMore={(tabProps: any)=>{
					socket.emit("loadNoti",{
						role: tabProps.name,
						skip: tabProps.list.length,
						limit: 10
					})
				}}
				onClear={tabProps => {}}
				>
				
				{
					auth.user?.roles.map((role,index) => {
						return (
							<NoticeIcon.Tab
								name={role}
								key={index}
								count={ 0}
								title={RoleHelper.toNameForNoti(role,noti.numUnread[role] || 0) as any}
								emptyText={"Không có thông báo"}
								list={NotiHelper.toList(noti.data[role] || []) as any}
								showClear={false}
								showViewMore={true}
							 	locale={{
									viewMore: "Xem thêm",
									
								}} onClear={()=>{}} onClick={()=>{}} onViewMore={()=>{
									
							}}/>
						)
					})
				}
				
				
				
			</NoticeIcon>
		</div>
	)
}