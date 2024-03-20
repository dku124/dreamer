import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@store/store.ts";
import {setSelectSku, skuSelector} from "@store/sku/sku.slice.ts";
import {useEffect, useState} from "react";
import SkuThunk from "@store/sku/sku.thunk.ts";
import {Button, Spin, Table} from "antd";
import {NumberUtil} from "@utils/number.util.ts";
import {SkuHelper} from "@/common/helpers/sku.helper.tsx";
import {SKU} from "@/@types/repo/sku.type.ts";
import {RepoModal} from "@/modals/analysis/repo/repo.modal.tsx";


type Props = {
	record: any
}
export function SubTableAnalysis(props: Props)
{
	const dispatch = useDispatch<AppDispatch>()
	const sku =useSelector(skuSelector);
	const [config, setConfig] = useState<Record<string, boolean>>({
		view:false
	});
	useEffect(() => {
		if (props.record)
		{
			dispatch(SkuThunk.listByProduct(props.record._id))
		}
	}, [props.record]);
	const toggle = (name:string)	=> {
		setConfig({...config, [name]:!config[name]})
	}
	
	// @ts-ignore
	const totalMoney = (sku:SKU,option:number) => {
		if (!sku)
		{
			return 0
		}
		switch (option) {
			case 1: // po
				if (sku.state)
				{
					return 0
				}
				return sku.colors.reduce((total:number, item) => {
					return total + item.sizes.reduce((totalSize:number, size) => {
						return totalSize + (size.reQuantity * size.importPrice)
					}, 0)
				}, 0)
			case 2:
				if (sku.state)
				{
					return sku.colors.reduce((total:number, item) => {
						return total + item.sizes.reduce((totalSize:number, size) => {
							return totalSize + (size.quantity * size.importPrice)
						}, 0)
					}, 0)
				}
				return 0
			default:
				return (totalMoney(sku,1) + totalMoney(sku,2)) as number
		}
	}
	
	
	return (
		<Spin spinning={ false}>
			{
				config.view && (<RepoModal open={config.view} onCancel={() => toggle('view')} />)
			}
			
			<Table 
				dataSource={sku.listByProduct[props.record._id]?.data || []} 
				pagination={false} rowKey={"_id"}
				onRow={(record:SKU) => {
					return {
						onClick: () => {
							dispatch(setSelectSku(record))
						}
					}
				}}
			>
				<Table.Column width={100} title={"STT"} align={"center"} render={NumberUtil.toIndex}/>
				<Table.Column title={"Mã SKU"} dataIndex={"code"} key={"code"} align={"left"}/>
				{/*<Table.Column title={"Sản phẩm"} dataIndex={"product"} key={"product"} align={"left"} render={(e:Product)=>e.name}/>*/}
				<Table.Column title={"Nơi nhập"} align={"center"} width={100} dataIndex={"importAddress"} />
				<Table.Column title={"Màu"} dataIndex={"colors"} render={SkuHelper.renderColor} />
				<Table.Column title={"SL Đã nhập"} align={"center"} width={150} dataIndex={"colors"} render={SkuHelper.renderQuantityTotalImport} />
				<Table.Column title={"SL Hiện tại"} align={"center"} width={150} dataIndex={"colors"} render={SkuHelper.renderQuantityInStock} />
				<Table.Column title={"Tổng PO"} render={(e:SKU)=> NumberUtil.toNumberMoney(totalMoney(e,1))} />
				<Table.Column title={"Tổng tồn"} render={(e:SKU)=> NumberUtil.toNumberMoney(totalMoney(e,2))} />
				<Table.Column title={"Tổng vốn"}  render={(e:SKU)=> NumberUtil.toNumberMoney(totalMoney(e,3))} />
				<Table.Column title={"Hành động"} 
				render={(value:SKU, record, index) => {
					return (
						<Button type={"primary"} onClick={() => {
							toggle('view')
						}}>Chi tiết</Button>
					)
				}}
				
				/>
			</Table>
		</Spin>
	)
}