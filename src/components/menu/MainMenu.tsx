import {Menu} from "antd";
import React, {useEffect} from "react";
import {
	FaAdversal,
	FaCartArrowDown,
	FaClipboardList,
	FaShippingFast,
	FaShoppingCart,
	FaUserFriends,
	FaUsers,
	FaWarehouse
} from "react-icons/fa";
import {IoSettings} from "react-icons/io5";
import {FaUserCheck, FaUserGroup} from "react-icons/fa6";
import {CgAttribution} from "react-icons/cg";
import {MenuInfo} from "rc-menu/lib/interface";
import {MdProductionQuantityLimits} from "react-icons/md";
import {useLocation, useNavigate} from "react-router";
import {UserRole} from "@/@types/user.type";
import {useDispatch, useSelector} from "react-redux";
import {authSelector} from "@/common/store/auth/auth.slice";
import {AppDispatch} from "@/common/store/store";
import {setBreadcrumb, setTitle} from "@/common/store/config/config.slice";
import {SiCampaignmonitor, SiSimpleanalytics} from "react-icons/si";

export function MainMenu()
{
	const navigate = useNavigate();
	const locationPath = useLocation();
	const auth = useSelector(authSelector)
	const [path, setPath] = React.useState<string>("");
	const dispatch = useDispatch<AppDispatch>();
	const items = [
		{
			key: 'quanlyuser',
			icon: <div><FaUsers size={25} /></div>,
			label: 'Quản lý người dùng',
			roles:[UserRole.ADMIN]
		},
		{
			key: 'quanlykhachhang',
			icon: <FaUserFriends size={25} /> ,
			label: 'Quản lý khách hàng',
			roles:[UserRole.ADMIN,UserRole.TELE_SALE]
		},
		{
			key: 'quanlykho',
			icon: <FaWarehouse  size={25} />,
			label: 'Quản lý kho',
			children: [
				{
					key: 'quanlynhacungcap',
					icon: <FaUserCheck size={25} />,
					label: 'Quản lý nhà cung cấp',
					roles:[UserRole.ADMIN,UserRole.ACCOUNTANT,UserRole.WAREHOUSE,UserRole.ACCOUNTANT]
				},
				{
					key: 'quanlydonvikho',
					icon: <CgAttribution size={25} />,
					label: 'Quản lý đơn vị kho',
					roles:[UserRole.ADMIN,UserRole.ACCOUNTANT,UserRole.WAREHOUSE,UserRole.ACCOUNTANT]
				},
				{
					key: 'quanlydanhmuc',
					icon: <FaClipboardList  size={25} />,
					label: 'Quản lý danh mục',
					roles:[UserRole.ADMIN,UserRole.ACCOUNTANT,UserRole.WAREHOUSE,UserRole.ACCOUNTANT]
				},
				{
					key: 'quanlysanpham',
					icon: <MdProductionQuantityLimits size={25} />,
					label: 'Quản lý sản phẩm',
					roles:[UserRole.ADMIN,UserRole.ACCOUNTANT,UserRole.WAREHOUSE,UserRole.ACCOUNTANT]
				},
			],
			roles:[UserRole.ADMIN,UserRole.ACCOUNTANT,UserRole.WAREHOUSE,UserRole.LEADER]
		},
		{
			key: 'quanlydon',
			icon: <FaShoppingCart size={25} />,
			label: 'Quản lý đơn',
			roles:[UserRole.ADMIN,UserRole.TELE_SALE,UserRole.ACCOUNTANT,UserRole.LEADER]
		},
		{
			key: 'vandon',
			icon: <FaShippingFast size={25} />,
			label: 'Quản lý vận đơn',
			roles:[UserRole.ADMIN,UserRole.ACCOUNTANT,UserRole.DELIVERY,UserRole.LEADER]
		},
		{
			key: 'setting',
			icon: <IoSettings size={25} />,
			label: 'Cấu hình',
			roles:[UserRole.ADMIN,UserRole.LEADER]
		},
		{
			key: "campaign",
			icon: <SiCampaignmonitor  size={25} />,
			label: "Quản lý chiến dịch",
			roles:[UserRole.ADMIN,UserRole.MARKETING,UserRole.LEADER]
		},
		{
			key: 'thongke',
			icon: <SiSimpleanalytics  size={25} />,
			label: 'Thống kê',
			children: [
				{
					key: 'tongquan',
					icon: <FaCartArrowDown  size={25} />,
					label: 'Thống kê tổng quan',
					roles:[UserRole.ADMIN]
				},
				{
					key: 'donhang',
					icon: <FaShoppingCart size={25} />,
					label: 'Thống kê đơn hàng',
					roles:[UserRole.ADMIN,UserRole.TELE_SALE]
				},
				{
					key: 'giaohang',
					icon: <FaShippingFast size={25} />,
					label: 'Thống kê vận đơn',
					roles:[UserRole.ADMIN,UserRole.DELIVERY]
				},
				{
					key: "kho",
					icon: <FaWarehouse size={25} />,
					label: "Thống kê kho",
					roles:[UserRole.ADMIN,UserRole.WAREHOUSE]
				},
				{
					key: "quangcao",
					icon: <FaAdversal  size={25} />,
					label: "Thống kê chiến dịch",
					roles:[UserRole.ADMIN,UserRole.LEADER,UserRole.MARKETING]
				},
				{
					key: "khachhang",
					icon: <FaUserGroup  size={25} />,
					label: "Thống kê khách hàng",
					roles:[UserRole.ADMIN,UserRole.LEADER,UserRole.TELE_SALE]
				}
				
			]
		}
	]

	const onClick = (info:MenuInfo) =>
	{
		const findByKey = (key:string,items:any) => {
			for(let i = 0; i < items.length; i++){
				if(items[i].key === key){
					return items[i];
				}
			}
			return null;
		}
		const path = info.keyPath.reverse().join("/");
		const floatMenu = items.flatMap(item => {
			if(item.children){
				return [...item.children,item];
			}
			return item;
		})
		const keys = info.keyPath
		const listItem:any[] = [];
		for(let i = 0; i < keys.length; i++){
			const key = keys[i];
			const item = findByKey(key,floatMenu);
			if(item){
				listItem.push(item);
			}
		}
		const label = listItem[listItem.length - 1].label;
		dispatch(setTitle(label));
		setPath(info.key);
		dispatch(setBreadcrumb(listItem.map(item => {
			return {
				key: item.key,
				label: item.label
			}
		})))
		navigate("/dashboard/"+path);
	}

	useEffect(() => {
		if(locationPath.pathname !== "/dashboard" && locationPath.pathname !== "dashboard"){
			const path = locationPath.pathname.split("/")[locationPath.pathname.split("/").length - 1];
			setPath(path);
		}
	}, [locationPath.pathname])


	const fillterByRole = () =>{
		const checkInclude = (roles:UserRole[],userRoles:UserRole[]) => {
			for(let i = 0; i < roles.length; i++){
				if(userRoles.includes(roles[i])){
					return true;
				}
			}
			return false;
		}
		const itemFillter = items.filter(item => {
			if(item.roles){
				return checkInclude(item.roles,auth.roles);
			}
			return true;
		})
		const newItems:any[] = []
		itemFillter.forEach(item => {
			if(!item.children){
				newItems.push(item);
				newItems.push({
					type: 'divider'
				})
				return;
			}
			const children = item.children;
			const newChildren:any[] = [];
			children.forEach(child => {
				if(checkInclude(child.roles,auth.roles)){
					newChildren.push(child);
				}
			})
			if(newChildren.length > 0){
				item.children = newChildren;
				newItems.push(item);
				newItems.push({
					type: 'divider'
				})
			}
		})
		return newItems;
	}

	


	return (
		<Menu 
			theme="light"
			mode="inline"
			defaultSelectedKeys={[path]}
			selectedKeys={[path]}
			items={fillterByRole()}
			onClick={onClick}
		/> 
	)
}