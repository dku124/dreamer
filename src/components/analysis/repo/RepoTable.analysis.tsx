import {Table} from "antd";
import {NumberUtil} from "@utils/number.util.ts";
import {reportSelector} from "@store/report/report.slice.ts";
import {useDispatch, useSelector} from "react-redux";
import {Category, CategoryStatus} from "@/@types/repo/category.type.ts";
import {categorySelector} from "@store/category/category.slice.ts";
import {useEffect, useState} from "react";
import {AppDispatch} from "@store/store.ts";
import ReportThunk from "@store/report/report.thunk.ts";
import ProductTable from "@/modals/analysis/repo/Product.table.tsx";

export function RepoTableAnalysis()
{
	const report = useSelector(reportSelector)
	const category = useSelector(categorySelector)
	const [selectId, setSelectId] = useState<string[]>([])
	const coverData = category.list.filter((item:Category) => item.status === CategoryStatus.ACTIVE)
	const dispatch = useDispatch<AppDispatch>()
	useEffect(() => {
		console.log(report)
		dispatch(ReportThunk.getListAndSKU())
	}, []);
	
	
	
	return (
		<Table 
			
			className={"table shadow border-radius"} 
			dataSource={report.getListAndSKU.filter((item:Category) => item.status === CategoryStatus.ACTIVE)} 
			pagination={false} 
			rowKey={"_id"}
			expandable={{
				expandedRowKeys:selectId,
				expandedRowRender: (record:Category,index: number, indent: number, expanded: boolean) => {
					return expanded ? <ProductTable record={record}/> : null
				},
				rowExpandable: record => true,
				
			}}
			onRow={(record:Category) => {
				return {
					onClick: () => {
						if (selectId.includes(record._id)) {
							console.log(selectId)
							setSelectId(selectId.filter((item:string) => item !== record._id))
						} else {
							setSelectId([...selectId, record._id])
						}
					}
				}
			}}
		>
			<Table.Column width={100} title={"STT"} align={"center"} render={NumberUtil.toIndex}/>
			<Table.Column title={"Tên danh mục"} dataIndex={"name"} key={"name"} align={"left"}/>
			<Table.Column title={"Tổng PO"}  
			render={(record:Category) => {
				const findPriceUnit= (id:string) => record.priceUnits.find((item) => item._id === id)
				const totalPO = record.skus.filter((item) => item.state==false).reduce((total:number, item) => {
					const priceUnit = findPriceUnit((item.priceUnit)as unknown as string)
					return total + item.colors.reduce((totalColor:number, color) => {
						return totalColor + color.sizes.reduce((totalSize:number, size) => {
							return totalSize + (size.reQuantity * ( size.importPrice* (priceUnit?.value || 0)))
						}, 0)
					}, 0)
				}, 0)
				return NumberUtil.toNumberMoney(totalPO)
			}}
			/>
			<Table.Column title={"Tổng tồn"}
			  render={(record:Category) => {
				  const findPriceUnit= (id:string) => record.priceUnits.find((item) => item._id === id)
				  const totalInverter = record.skus.filter((item) => item.state==true).reduce((total:number, item) => {
					  const priceUnit = findPriceUnit((item.priceUnit)as unknown as string)
					  return total + item.colors.reduce((totalColor:number, color) => {
						  return totalColor + color.sizes.reduce((totalSize:number, size) => {
							  return totalSize + (size.quantity * ( size.importPrice* (priceUnit?.value || 0)))
						  }, 0)
					  }, 0)
				  }, 0)
				  return NumberUtil.toNumberMoney(totalInverter)
			  }}
			/>
			<Table.Column title={"Tổng vốn"} 
			render={(record:Category) => {
				const findPriceUnit= (id:string) => record.priceUnits.find((item) => item._id === id)
				const totalInverter = record.skus.filter((item) => item.state).reduce((total:number, item) => {
					const priceUnit = findPriceUnit((item.priceUnit)as unknown as string)
					return total + item.colors.reduce((totalColor:number, color) => {
						return totalColor + color.sizes.reduce((totalSize:number, size) => {
							return totalSize + (size.quantity * ( size.importPrice* (priceUnit?.value || 0)))
						}, 0)
					}, 0)
				}, 0)
				const totalPO = record.skus.filter((item) => !item.state).reduce((total:number, item) => {
					const priceUnit = findPriceUnit((item.priceUnit)as unknown as string)
					return total + item.colors.reduce((totalColor:number, color) => {
						return totalColor + color.sizes.reduce((totalSize:number, size) => {
							return totalSize + (size.reQuantity * ( size.importPrice* (priceUnit?.value || 0)))
						}, 0)
					}, 0)
				}, 0)
				return NumberUtil.toNumberMoney((totalInverter) + (totalPO))
			}}
			/>
		</Table>
	)
}