import { Button, DatePicker, Input, Select, Space, Table, Tooltip } from "antd";
import { IoMdAdd } from "react-icons/io";
import { IoReload } from "react-icons/io5";
import dayjs from "dayjs";
import { DateUtil } from "@utils/date.util.tsx";
import { useQuery } from "@hooks/page.hook.ts";
import { useEffect, useState } from "react";
import { NumberUtil } from "@utils/number.util.ts";
import { Camp, CampStatus, CampType } from "@/@types/camp/camp.type.ts";
import { CampHelper } from "@/common/helpers/camp.helper.tsx";
import { useDispatch, useSelector } from "react-redux";
import { campSelector, setCampSelect } from "@store/camp/camp.slice.ts";
import { AppDispatch } from "@store/store.ts";
import CampThunk from "@store/camp/camp.thunk.ts";
import Pagination from "@components/pagination/paginationx.tsx";
import { Product } from "@/@types/repo/product.type.ts";
import { settingSelector } from "@store/setting/setting.slice.ts";
import SettingThunk from "@store/setting/setting.thunk.ts";
import { CampDetailTable } from "@/modals/camp/CampDetail.modal.tsx";
import { CampUpdateModal } from "@/modals/camp/CampUpdate.modal.tsx";
import ReportThunk from "@store/report/report.thunk.ts";
import { FaDownload } from "react-icons/fa";
import { CampCreateModal } from "@/modals/camp/CampCreate.modal";
import { AdCreateModal } from "@/modals/ad/AdCreate.model";

export default function CampManager() {
	const dispatch = useDispatch<AppDispatch>()
	const setting = useSelector(settingSelector)
	const camp = useSelector(campSelector)
	const [selectId, setSelectId] = useState<string[]>([])
	const configUnit = setting?.configUnit.list
	const [query, setQuery] = useQuery({
		from: DateUtil.getNowDateByFormat(DateUtil.dateFormat),
		to: DateUtil.getNowDateByFormat(DateUtil.dateFormat),
	})
	const [configModal, setConfigModal] = useState<Record<string, boolean>>({
		createCamp: false,
		createAd: false,
		update: false,
		details: false,
	})
	const toggleModal = (modal: string) => {
		return () => {
			setConfigModal({ ...configModal, [modal]: !configModal[modal] })
		}
	}

	useEffect(() => {
		dispatch(CampThunk.getPage(query))
		dispatch(SettingThunk.configUnit.getList())
	}, [query]);


	const selectCamp = (camp: Camp) => {
		dispatch(setCampSelect(camp))
	}

	const select = (id: string) => {
		if (selectId.includes(id)) {
			setSelectId(selectId.filter((item: string) => item !== id))
		} else {
			setSelectId([...selectId, id])
		}
	}

	const downloadExcel = () => {
		dispatch(ReportThunk.dowloadExcelCamp(query))
	}
	return (
		<div id={"CampManager"}>
			<div className={"header-control"}>
				{configModal.update && (<CampUpdateModal open={configModal.update} onCancel={toggleModal("update")} />)}
				{configModal.createCamp && (<CampCreateModal open={configModal.createCamp} onCancel={toggleModal("createCamp")} />)}
				{configModal.createAd && (<AdCreateModal open={configModal.createAd} onCancel={toggleModal("createAd")} />)}
				<div>
					<Tooltip title={"Thêm chiến dịch mới"}>
						<Button className={"btn"} shape={"circle"}
							type={"primary"} icon={<IoMdAdd />}
							onClick={toggleModal("createCamp")}
						/>
					</Tooltip>
					<Tooltip title={"Tải lại"}>
						<Button className={"btn"} shape={"circle"}
							type={"primary"} icon={<IoReload />}
							onClick={e => setQuery({ ...query })}
						/>
					</Tooltip>
					<Tooltip title={"Xuất Excel"}>
						<Button className={"btn"} shape={"circle"}
							type={"primary"} icon={<FaDownload />}
							onClick={downloadExcel}
						/>
					</Tooltip>
				</div>
				<div>
					<Space.Compact>
						<Select
							defaultValue={""}
							style={{ width: "150px" }}
							className={"select"} placeholder={"Trạng thái"}
							value={query.type} onChange={e => setQuery({ type: e })}
						>
							<Select.Option value={""}>
								{
									CampHelper.toType("")
								}
							</Select.Option>
							{
								Object.keys(CampType).map((e: string) => {
									return <Select.Option value={e} key={e}>
										{CampHelper.toType(e)}
									</Select.Option>
								})
							}

						</Select>
						<Select
							defaultValue={""}
							style={{ width: "150px" }}
							className={"select"} placeholder={"Trạng thái"}
							value={query.status} onChange={e => setQuery({ status: e })}
						>
							<Select.Option value={""}>
								{
									CampHelper.toStatus("")
								}
							</Select.Option>
							{
								Object.keys(CampStatus).map((e: string) => {
									return <Select.Option value={e} key={e}>
										{CampHelper.toStatus(e)}
									</Select.Option>
								})
							}

						</Select>
						<DatePicker.RangePicker
							value={[
								dayjs(query.from, DateUtil.dateFormat),
								dayjs(query.to, DateUtil.dateFormat)
							]}
							onChange={(_, e: Array<string>) => {
								if (_) {
									setQuery({
										...query,
										from: e[0],
										to: e[1],
										page: 1
									})
								} else {
									setQuery({
										...query,
										from: "20/11/2002",
										to: "20/11/2222",
										page: 1
									})
								}
							}}
							format={DateUtil.dateFormat}
							renderExtraFooter={() => {
								return DateUtil.DatePickerFooter(setQuery)
							}}
						/>
						<Input.Search
							allowClear className={"input-search"}
							placeholder={"Tìm kiếm"} width={"300px"}
							onSearch={e => setQuery({ query: e, page: 1 })} enterButton
						/>
					</Space.Compact>
				</div>
			</div>
			<div className={"body-control"}>
				<Table dataSource={camp.data?.data || []}
					pagination={false} rowKey={"_id"}
					loading={camp.loadings.page}
					scroll={{ x: 2100 }}
					expandable={{
						expandedRowKeys: selectId,
						expandedRowRender: (record: Camp, index: number, indent: number, expanded: boolean) => {
							return expanded ? <CampDetailTable query={query} record={record} /> : null
						},
						rowExpandable: record => true,
					}}
					onRow={(record: Camp) => {
						return {
							onClick: () => {
								selectCamp(record)
								select(record._id)
							},
						};
					}}
				>
					<Table.Column title={"STT"} align={"center"} width={100} render={NumberUtil.toIndex} />
					<Table.Column title={"Loại"} dataIndex={"typeCamp"} width={140} render={CampHelper.toType} />
					<Table.Column title={"Tên Camp"} dataIndex={"campName"} width={300} />
					{/*<Table.Column title={"Ảnh"} dataIndex={'product'} width={130} align={"center"} render={ProductHelper.renderImg2} />*/}
					<Table.Column title={"Mã SP"} dataIndex={"product"} width={150} align={"left"} render={(e: Product) => e.code} />
					<Table.Column title={"Giá SP"} dataIndex={"name"} align={"center"} width={150} />
					<Table.Column title={"Giá CĐ cho phép"} dataIndex={"priceAllow"} align={"center"} width={150} render={NumberUtil.toNumberMoney} />
					<Table.Column title={"Giá CĐ"} align={"center"} width={150} render={CampHelper.toCD} />
					<Table.Column title={"Số CĐ"} dataIndex={"totalWebcake"} align={"center"} width={150} render={NumberUtil.toNumberMoney} />
					<Table.Column title={"Chi phí QC"} dataIndex={"ads"} align={"center"} width={150} render={CampHelper.toTotalSpend} />
					<Table.Column title={"Chênh lệch (%)"} align={"center"} width={150} render={CampHelper.toCDAllow} />
					<Table.Column title={"Số Click"} align={"center"} width={100} dataIndex={"ads"} render={CampHelper.toTotalClick} />
					<Table.Column title={"CPM"} align={"center"} width={150} dataIndex={"ads"} render={CampHelper.toTotalCPM} />
					<Table.Column title={"CPC"} align={"center"} width={150} dataIndex={"ads"} render={CampHelper.toTotalCPC} />
					<Table.Column title={"Trạng thái"} align={"center"} width={150} dataIndex={"status"} render={CampHelper.toStatus} />
					<Table.Column title={"Hành động"} width={260} align={"center"} fixed={"right"} render={(_, record: Camp) => {
						return <Space.Compact>
							<Button type={"primary"}
								onClick={toggleModal("update")}
							>Cập nhật</Button>
							<Button type={"primary"}
								onClick={toggleModal("createAd")}
							>Thêm quảng cáo</Button>
						</Space.Compact>
					}} />
					
				</Table>
				<Pagination query={query} onChange={setQuery} page={camp.data} />
			</div>
		</div>
	)
}