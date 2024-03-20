import {Button, Input, Space, Table, Tooltip} from "antd";
import {IoMdAdd} from "react-icons/io";
import {IoReload} from "react-icons/io5";
import {useEffect, useState} from "react";
import {useQuery} from "@hooks/page.hook.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@store/store.ts";
import {setConfigUnitSelect, settingSelector} from "@store/setting/setting.slice.ts";
import SettingThunk from "@store/setting/setting.thunk.ts";
import {NumberUtil} from "@utils/number.util.ts";
import {DateUtil} from "@utils/date.util.tsx";
import {OnselectRow} from "@utils/method.utils.tsx";
import {ConfigUnit} from "@/@types/config/configUnit.type.ts";
import ConfigUnitCreateModal from "@/modals/config/configUnit/ConfigUnitCreate.modal.tsx";
import ConfigUnitUpdateModal from "@/modals/config/configUnit/ConfigUnitUpdate.modal.tsx";

export default function ConfigUnit()
{
	const dispatch = useDispatch<AppDispatch>()
	const setting = useSelector(settingSelector)
	
	const [query,setQuery] = useQuery()
	const [configModal,setConfigModal] = useState<Record<string, boolean>>({
		create: false,
		update: false,
	})

	useEffect(() =>{
		dispatch(SettingThunk.configUnit.getPage(query))
	}, [query])

	const toggleModal = (modal:string) => {
		return () => {
			setConfigModal({...configModal,[modal]:!configModal[modal]})
		}
	}
	const selectConfigUnit = (configCamp:ConfigUnit) => {
		dispatch(setConfigUnitSelect(configCamp))
	}


	return (
		<div>
			<div className={"header-control"}>
				<div>
					{
						configModal.create && <ConfigUnitCreateModal open={configModal.create} onCancel={toggleModal("create")} />
					}
					{
						configModal.update && <ConfigUnitUpdateModal open={configModal.update} onCancel={toggleModal("update")} />
					}
					<Tooltip title={"Thêm đơn vị tiền tệ"}>
						<Button className={"btn"} shape={"circle"}
								type={"primary"} icon={<IoMdAdd />}
								onClick={toggleModal("create")}
						/>
					</Tooltip>
					<Tooltip title={"Tải lại"}>
						<Button className={"btn"} shape={"circle"}
								type={"primary"} icon={<IoReload />}
								onClick={e=>setQuery({...query})}
						/>
					</Tooltip>
				</div>
				<div>
					<Input.Search
						allowClear  className={"input-search"}
						placeholder={"Tìm kiếm"} width={"300px"}
						onSearch={e=>setQuery({query:e,page:1})} enterButton
					/>
				</div>
			</div>
			<div className={"body-main"}>
				<Table dataSource={setting?.configUnit?.data?.data}
					   pagination={false} rowKey={"_id"}
					   onRow={(record:ConfigUnit) => OnselectRow(record,selectConfigUnit)}
					   loading={setting?.configUnit?.loading}
				>
					<Table.Column title={"STT"} render={NumberUtil.toIndex} />
					<Table.Column title={"Tên"} dataIndex={"key"} />
					<Table.Column title={"Số tiền"} dataIndex={"value"} render={NumberUtil.toFloatMoney} />
					<Table.Column title={"Ngày tạo"} dataIndex={"createdAt"} render={DateUtil.toLocaleString} />
					<Table.Column title={"Ngày cập nhật"} dataIndex={"updatedAt"} render={DateUtil.toLocaleString} />
					<Table.Column title={"Hành động"} render={(_,record:ConfigUnit) => {
						return (
							<Space.Compact>
								<Tooltip title={"Cập nhật đơn vị"}>
									<Button type={"primary"} onClick={toggleModal("update")}>Cập nhật</Button>
								</Tooltip>
								{/*<Tooltip title={"Xóa token"}>*/}
								{/*	<Popconfirm title={"Bạn có chắc chắn muốn xóa đơn vị này?"} onConfirm={() => dispatch(SettingThunk.configUnit.delete(record))}>*/}
								{/*		<Button type={"primary"} danger>Xóa</Button>*/}
								{/*	</Popconfirm>*/}
								{/*</Tooltip>*/}
							</Space.Compact>
						)
					}} />
				</Table>
			</div>
		</div>
	)
}