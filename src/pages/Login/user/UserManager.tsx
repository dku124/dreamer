import {AppDispatch} from '../../../common/store/store';
import {useDispatch, useSelector} from "react-redux";
import {setSelectUser, userSelector} from "@store/user/user.slice.ts";
import {Button, Input, Space, Table, Tooltip} from "antd";
import {IoMdAdd} from "react-icons/io";
import './UserManager.scss'
import {IoReload} from "react-icons/io5";
import {NumberUtil} from "@utils/number.util.ts";
import {User, UserStatus} from "@/@types/user.type.ts";
import {RoleHelper} from "@/common/helpers/role.helper.tsx";
import {UserHelper} from "@/common/helpers/user.helper.tsx";
import {useQuery} from "@hooks/page.hook.ts";
import {useEffect, useState} from "react";
import UserThunk from "@store/user/user.thunk.ts";
import Pagination from "@components/pagination/paginationx.tsx";
import UserCreateModal from "@/modals/user/UserCreate.modal.tsx";
import {OnselectRow} from "@utils/method.utils.tsx";
import UserUpdateModal from "@/modals/user/UserUpdate.modal.tsx";
import UserUpdatePassModal from "@/modals/user/UserUpdatePass.modal.tsx";
import NotiThunk from '@/common/store/noti/noti.thunk';
import HistoryModal from '@/modals/sku/History.modal';

export default function UserManager() {
	const dispatch = useDispatch<AppDispatch>()
	const user = useSelector(userSelector)
	const [configModal, setConfigModal] = useState<Record<string, boolean>>({
		create: false,
		update: false,
		password: false,
		history: false
	})
	const [query, setQuery] = useQuery()

	useEffect(() => {
		dispatch(UserThunk.getPage(query))
	}, [query])

	const toggleModal = (modal: string) => {
		return () => {
			setConfigModal({ ...configModal, [modal]: !configModal[modal] })
		}
	}
	const selectUser = (user: User) => {
		dispatch(setSelectUser(user))
		dispatch(NotiThunk.getById(user._id))
	}

	const UpdateStatus = (user: User) => {
		dispatch(UserThunk.updateStatus({
			...user,
			status: user.status == UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE
		}))
	}

	return (
		<div id={"UserManager"}>
			{configModal.create && <UserCreateModal open={configModal.create} onCancel={toggleModal("create")} />}
			{configModal.update && <UserUpdateModal open={configModal.update} onCancel={toggleModal("update")} />}
			{configModal.password && <UserUpdatePassModal open={configModal.password} onCancel={toggleModal("password")} />}
			{
				configModal.history && (<HistoryModal title={"Lịch sử cập nhật"} open={configModal.history} onCancel={toggleModal("history")} />)
			}
			<div className={"header-control"}>
				<div>
					<Tooltip title={"Thêm người dùng"}>
						<Button className={"btn"} shape={"circle"}
							type={"primary"} icon={<IoMdAdd />}
							onClick={toggleModal("create")}
						/>
					</Tooltip>
					<Tooltip title={"Tải lại"}>
						<Button className={"btn"} shape={"circle"}
							type={"primary"} icon={<IoReload />}
							onClick={e => setQuery({ ...query })}
						/>
					</Tooltip>
				</div>
				<div>
					<Input.Search
						allowClear className={"input-search"}
						placeholder={"Tìm kiếm"} width={"300px"}
						onSearch={e => setQuery({ query: e, page: 1 })} enterButton
					/>
				</div>
			</div>
			<div className={"body-main"}>
				<Table pagination={false} rowKey={"_id"} dataSource={user.data?.data || []}
					onRow={(record: User) => OnselectRow(record, selectUser)}
					loading={user.loadings.getPage}
				>
					<Table.Column title={"STT"} width={10} align={"center"} render={NumberUtil.toIndex} />
					<Table.Column title={"Họ tên"} width={250} dataIndex={"fullName"} />
					<Table.Column title={"Tên đăng nhập"} width={130} dataIndex={"username"} />
					<Table.Column title={"Quyền"} dataIndex={"roles"} render={RoleHelper.join} />
					<Table.Column title={"Trạng thái"} dataIndex={"status"} render={UserHelper.toStatus} />
					<Table.Column title={"Hành động"} dataIndex={"_id"} render={(id: string, record: User) => {
						return (
							<Space.Compact>
								<Tooltip title={"Cập nhật"}>
									<Button type={"primary"} children={"Cập nhật"}
										onClick={toggleModal("update")}
									/>
								</Tooltip>
								<Tooltip title={record.status == UserStatus.ACTIVE ? "Khóa" : "Mở khóa"}>
									<Button type={"primary"}
										danger={record.status == UserStatus.ACTIVE}
										children={record.status == UserStatus.ACTIVE ? "Khóa" : "Mở khóa"}
										onClick={() => UpdateStatus(record)}
									/>
								</Tooltip>
								<Tooltip title={"Cấp mật khẩu mới"}>
									<Button type={"primary"} children={"Cấp mật khẩu mới"}
										onClick={toggleModal("password")}
									/>
								</Tooltip>
								<Tooltip title={"Lịch sử"}>
									<Button type={"primary"}
										onClick={toggleModal("history")}
									>Lịch sử</Button>
								</Tooltip>
							</Space.Compact>
						)
					}} />
				</Table>
			</div>
			<Pagination query={query} onChange={setQuery} page={user.data} />
		</div>
	)
}
