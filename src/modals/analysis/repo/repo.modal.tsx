import {Modal, ModalProps, Spin, Table, Tag} from "antd";
import {NumberUtil} from "@utils/number.util.ts";
import {Product} from "@/@types/repo/product.type.ts";
import {skuSelector} from "@store/sku/sku.slice.ts";
import {useDispatch, useSelector} from "react-redux";
import {ProductColor, ProductSize, SKU} from "@/@types/repo/sku.type.ts";
import {ConfigUnit} from "@/@types/config/configUnit.type.ts";
import {useEffect} from "react";
import {reportSelector} from "@store/report/report.slice.ts";
import {AppDispatch} from "@store/store.ts";
import ReportThunk from "@store/report/report.thunk.ts";

export function RepoModal(modalProps: ModalProps) {

	const sku = useSelector(skuSelector)
	const report = useSelector(reportSelector)
	const dispatch = useDispatch<AppDispatch>()
	useEffect(() => {
		if (sku.select)
		{
			dispatch(ReportThunk.reportOrderGroupBySize({
				id:sku?.select?._id || ''
			}))
		}
	}, []);
	
	const getQuantity = (size:ProductSize) => {
		const data = report.reportOrderGroupBySize.find((item:any) => item.size === size.id)
		return data?.count || 0
	}
	
	
	
	const coverData = () => {
		const skux = sku.select;
		const data = skux?.colors.map((item:ProductColor) => {
			return item.sizes.map((size) => {
				return {
					state:skux.state,
					priceUnit: skux.priceUnit,
					product: skux.product,
					color: item,
					size: size,
					sku: skux,
				}
			})
		})
		return data?.flat() || []
	}
	
	return (
		<Modal {...modalProps} width={1600} title={"Thông kê kho"}>
			<Spin spinning={report.loadding}>
				<Table dataSource={coverData()} >
					<Table.Column title={"STT"} render={NumberUtil.toIndex} />
					<Table.Column title={"Tên sản phẩm"} dataIndex={"product"} render={(e:Product)=> e.name} />
					<Table.Column title={"Màu"} dataIndex={"color"} render={(e:ProductColor) => e.color.toUpperCase()} />
					<Table.Column title={"Size"} dataIndex={"size"} render={(e:ProductSize) => e.size.toUpperCase()} />
					<Table.Column align={"center"} title={"Tồn kho(Tối thiểu-Tối đa)"} dataIndex={"product"} render={(e:Product)=> e.inventory.join(' - ')} />
					<Table.Column align={"center"} title={"SL PO"} dataIndex={"size"} render={(e:ProductSize)=> NumberUtil.toNumberMoney(e.reQuantity)} />
					<Table.Column align={"center"} title={"Giá nhập"} dataIndex={"size"} render={(e:ProductSize)=> NumberUtil.toNumberMoney(e.importPrice)} />
					<Table.Column align={"center"} title={"Tổng tiền PO"} render={(e:any)=>{
						return e.state  ? 0 : NumberUtil.toNumberMoney((e.size.importPrice * e.priceUnit.value  )* e.size.reQuantity)
					}} />
					<Table.Column align={"center"} title={"Đơn vị nhập"} dataIndex={"priceUnit"} render={(e:ConfigUnit)=> e.key} />
					<Table.Column align={"center"} title={"Nơi nhập"} dataIndex={"sku"} render={(e:SKU)=> e.importAddress} />
					<Table.Column align={"center"} title={"SL tồn"} dataIndex={"size"} render={(e:ProductSize)=> NumberUtil.toNumberMoney(e.quantity)} />
					<Table.Column align={"center"} title={"Tổng tiền tồn"} render={(e:any)=>{
						return NumberUtil.toNumberMoney((e.size.importPrice * e.priceUnit.value  )* e.size.quantity)
					}} />
					<Table.Column align={"center"} title={"SL đã lên đơn"} dataIndex={"size"} render={getQuantity} />
					<Table.Column align={"center"} title={"Tổng vốn"} 
					render={(e:any)=>{
						// tổng tiền PO 
						const tongtienpo = e.state  ? 0 : (e.size.importPrice * e.priceUnit.value  )* e.size.reQuantity
						// tổng tiền tồn
						const tongtienton = (e.size.importPrice * e.priceUnit.value  )* e.size.quantity;
						return NumberUtil.toNumberMoney(tongtienpo + tongtienton)
					}}
					/>
					<Table.Column align={"center"} title={"Tình trạng hàng"}
						render={(e:any)=>{
							if(e.size.quantity > e.product.inventory[0] && e.size.quantity < e.product.inventory[1]){
								return <Tag color={"green"}>Đủ hàng</Tag>
							}
							if(e.size.quantity <= e.product.inventory[0]){
								return <Tag color={"red"}>Thiếu hàng</Tag>
							}
							if(e.size.quantity >= e.product.inventory[1]){
								return <Tag color={"orange"}>Quá nhiều hàng</Tag>
							}
						}}
					/>
				</Table>
			</Spin>
		</Modal>
	)
}