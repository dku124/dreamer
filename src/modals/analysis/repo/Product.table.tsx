import {Table} from "antd";
import {NumberUtil} from "@utils/number.util.ts";
import {useEffect, useState} from "react";
import {Product} from "@/@types/repo/product.type.ts";
import {ProductHelper} from "@/common/helpers/product.helper.tsx";
import {SkuHelper} from "@/common/helpers/sku.helper.tsx";
import {SKU} from "@/@types/repo/sku.type.ts";
import {SubTableAnalysis} from "@pages/login/analysis/repo/subTable.analysis.tsx";

type Props = {
	record: any
}
export default function ProductTable(props:Props)
{

	useEffect(() => {
	}, [props.record]);
	
	const [listIndex,setListIndex] = useState<string[]>([])
	const expandable = {
		expandedRowKeys:listIndex,
		expandedRowRender: (record:any,index: number, indent: number, expanded: boolean) => {
			return expanded ? <SubTableAnalysis record={record}/> : null
		},
		rowExpandable: () => true,
	}
	
	const coverData = ()=>{
		const products = ((props.record?.products || []) as Product[])
		return products.map((item:Product) => {
			return {
				...item,
				key: item._id,
				skus: ProductHelper.GetSkuByProduct(item, props.record.skus)
			}
		})
	}

	
	const totalMoneys = (sku:SKU,option:number):number => {
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
				return (totalMoneys(sku,1) + totalMoneys(sku,2)) as number
		}
		
	}
	
	return (
		<Table expandable={expandable} dataSource={coverData()} pagination={false} rowKey={"_id"}
			   onRow={(record:any) => {
				   return {
					   onClick: () => {
						   if (listIndex.includes(record._id)) {
							   setListIndex(listIndex.filter((item:string) => item !== record._id))
						   } else {
							   setListIndex([...listIndex, record._id])
						   }
					   }
				   }
			   }}
		
		>
			<Table.Column width={100} title={"STT"} render={NumberUtil.toIndex}/>
			<Table.Column title={"Tên sản phẩm"} width={350}  dataIndex={"name"} key={"name"} align={"left"}/>
			<Table.Column title={"Màu"} width={300} dataIndex={"skus"} render={SkuHelper.toColorAndSizeFromSkus} />
			<Table.Column title={"SL Đã nhập"}  dataIndex={"skus"} render={(e:SKU[])=> {
				return NumberUtil.toNumberMoney( e.reduce((a,b)=>{
					return b.colors.reduce((a1,b1)=>{
						return b1.sizes.reduce((a2,b2)=>{
							return a2 + b2.reQuantity
						},0) + a1
					},0) + a
				},0))
			}}    />
			<Table.Column title={"SL Hiện tại"} dataIndex={"skus"} render={(e:SKU[])=> {
				return  NumberUtil.toNumberMoney(e.reduce((a,b)=>{
					return b.colors.reduce((a1,b1)=>{
						return b1.sizes.reduce((a2,b2)=>{
							return a2 + b2.quantity
						},0) + a1
					},0) + a
				},0))
			}}  />
			<Table.Column title={"Tổng PO"} dataIndex={"skus"} render={(e:SKU[])=>NumberUtil.toNumberMoney( e.reduce((a,b)=>{
				return totalMoneys(b,1) + a
			},0))} />
			<Table.Column title={"Tổng tồn"} dataIndex={"skus"} render={(e:SKU[])=>NumberUtil.toNumberMoney( e.reduce((a,b)=>{
				return totalMoneys(b,2) + a
			},0))}  />
			<Table.Column title={"Tổng vốn"} dataIndex={"skus"} render={(e:SKU[])=>NumberUtil.toNumberMoney( e.reduce((a,b)=>{
				return totalMoneys(b,3) + a
			},0))}  />
		</Table>
	)
}