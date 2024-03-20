import {Button, Modal, ModalProps, Space, Table} from "antd";
import {NumberUtil} from "@utils/number.util.ts";
import {DateUtil} from "@utils/date.util.tsx";
import {skuSelector} from "@store/sku/sku.slice.ts";
import {AppDispatch} from "@store/store.ts";
import {useDispatch, useSelector} from "react-redux";
import {notiSelector, selectNoti} from "@store/noti/noti.slice.ts";
import React, {useEffect, useState} from "react";
import NotiThunk from "@store/noti/noti.thunk.ts";
import {NotiHelper} from "@/common/helpers/noti.helper.tsx";
import {OnselectRow} from "@utils/method.utils.tsx";
import {Noti} from "@/@types/noti/noti.type.ts";
import {NotiModal} from "@/modals/noti/noti.modal.tsx";
import { productSelector } from "@/common/store/product/product.slice";

export default function HistoryModal(props: ModalProps) {
	const dispatch = useDispatch<AppDispatch>()
	const noti = useSelector(notiSelector)
	const [config,setConfig] = useState({
		open: false,
	})
	
	
	const toggleModal = () => {
		
		setConfig({
			...config,
			open: !config.open
		})
	}
	
	const setSelect = (noti:Noti) => {
		dispatch(selectNoti(noti))
	}
	
	
	return(
		<div>
			{ config.open && (<NotiModal open={config.open} onCancel={toggleModal} />) }
			<Modal width={720} {...props} okButtonProps={{style:{display:"none"}}} cancelText={"Đóng"}>
				<Table rowKey={"_id"} loading={noti.loadings?.getById} dataSource={noti.list}
					
					onRow={(e)=>OnselectRow(e,setSelect)}
				
				>
					<Table.Column title={"STT"} render={NumberUtil.toIndex} />
					<Table.Column title={"Ngày cập nhật"} dataIndex={"createdAt"} render={DateUtil.toCreateAt} />
					<Table.Column title={"Trạng thái"}  render={NotiHelper.toTitle} />
					<Table.Column title={"Người cập nhật"} dataIndex={"fullName"} />
					<Table.Column title={"Hành động"} render={()=>{
						return(
							<Space.Compact>
								<Button type={"primary"} onClick={toggleModal}>Xem</Button>
							</Space.Compact>
						)
					}} />
				</Table>
			</Modal>
		</div>
	)
}