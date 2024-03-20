import {Button, Input, Popconfirm, Space, Table, Tooltip} from "antd";
import {IoMdAdd} from "react-icons/io";
import {IoReload} from "react-icons/io5";
import {useEffect, useState} from "react";
import {useQuery} from "@hooks/page.hook.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@store/store.ts";
import {setConfigCampSelect, settingSelector} from "@store/setting/setting.slice.ts";
import SettingThunk from "@store/setting/setting.thunk.ts";
import {NumberUtil} from "@utils/number.util.ts";
import {DateUtil} from "@utils/date.util.tsx";
import {ConfigCamp} from "@/@types/config/configCamp.type.ts";
import {OnselectRow} from "@utils/method.utils.tsx";
import ConfigCampCreateModal from "@/modals/config/configCamp/ConfigCampCreate.modal.tsx";
import ConfigCampUpdateModal from "@/modals/config/configCamp/ConfigCampUpdate.modal.tsx";

export default function ConfigCamp()
{
	const dispatch = useDispatch<AppDispatch>()
	const setting = useSelector(settingSelector)
	const [query,setQuery] = useQuery()
	const [configModal,setConfigModal] = useState<Record<string, boolean>>({
		create: false,
		update: false,
	})
	
	useEffect(() =>{
		dispatch(SettingThunk.configCamp.getPage(query))
	}, [query])
	
	const toggleModal = (modal:string) => {
		return () => {
			setConfigModal({...configModal,[modal]:!configModal[modal]})
		}
	}
	const selectConfigCamp = (configCamp:ConfigCamp) => {
		dispatch(setConfigCampSelect(configCamp))
	}
	
	
	return (
		<div>
			<div className={"header-control"}>
				<div>
					{
						configModal.create && <ConfigCampCreateModal open={configModal.create} onCancel={toggleModal("create")} />
					}
					{
						configModal.update && <ConfigCampUpdateModal open={configModal.update} onCancel={toggleModal("update")} />
					}
					<Tooltip title={"Thêm token"}>
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
				<Table dataSource={setting?.configCamp?.data?.data}
					   pagination={false} rowKey={"_id"} 
					   onRow={(record:ConfigCamp) => OnselectRow(record,selectConfigCamp)}
					   loading={setting?.configCamp?.loading}
				>
					<Table.Column title={"STT"} align={"center"} render={NumberUtil.toIndex} />
					<Table.Column title={"Ghi chú"} dataIndex={"note"} />
					<Table.Column title={"Ngày tạo"} dataIndex={"createdAt"} render={DateUtil.toLocaleString} />
					<Table.Column title={"Ngày cập nhật"} dataIndex={"updatedAt"} render={DateUtil.toLocaleString} />
					<Table.Column title={"Hành động"} render={(_,record:ConfigCamp) => {
						return (
							<Space.Compact>
								<Tooltip title={"Cập nhật token"}>
									<Button type={"primary"} onClick={toggleModal("update")}>Cập nhật</Button>
								</Tooltip>
								<Tooltip title={"Xóa token"}>
									<Popconfirm title={"Bạn có chắc chắn muốn xóa token này?"} onConfirm={() => dispatch(SettingThunk.configCamp.delete(record))}>
										<Button type={"primary"} danger>Xóa</Button>
									</Popconfirm>
								</Tooltip>
							</Space.Compact>
						)
					}} />
				</Table>
			</div>
		</div>
	)
}