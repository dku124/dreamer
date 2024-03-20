import dayjs from "dayjs";
import {AddOnInfo, OrderStatus, OrderTag, OrderWarning} from "@/@types/order/order.type.ts";
import {Tag} from "antd";
import {OrderDetail, OrderDetailColor} from "@/@types/order/detail.type.ts";
import {Product} from "@/@types/repo/product.type.ts";
import {ProductColor, SKU} from "@/@types/repo/sku.type.ts";
import {ShipSession} from "@/@types/order/ship.type.ts";
import {DateUtil} from "@utils/date.util.tsx";
import {User} from "@/@types/user.type.ts";

export class OrderHelper
{
	static timeConfirm(date:Date)
	{
		if (!date)
		{
			return ""
		}
		return dayjs(date).format("HH:mm DD/MM/YYYY")
	}
	
	static toStockStatus(details:Array<OrderDetail>)
	{
		return  details.map(e=>{
			let product = e.product
			
			let sku = e.sku
			return <div>{sku?.code || "" }- {sku?.state?"Đã về":"Chưa về"}</div>
		})
	}
	
	
	static SourceOrder(data:AddOnInfo)
	{
		if (!data || !data.link)
		{
			return ""
		}
		const url = new URL(data.link || "")
		return <div style={{
			width:"200px"
		}}>
			<a href={data.link} target={"_blank"}>{url.host}</a>
		</div>
	}
	
	
	static GetStatusColor(orderStatus:string)
	{
		switch (orderStatus)
		{
			case OrderStatus.PENDING:
				return "#f39c12"
			case OrderStatus.CONFIRMED:
				return "#27ae60"
			case OrderStatus.CANCELLED:
				return "#FF0000"
			case OrderStatus.DUPLICATE_NUMBER:
				return "#8e44ad"
			case OrderStatus.UNABLE_TO_CONTACT:
				return "#e74c3c"
			case OrderStatus.HAVING_MALICIOUS_INTENT:
				return "#2c3e50"
			default:
				return "#3498db"
		}
	}
	
	
	
	static Status(orderStatus:string)
	{
		switch (orderStatus)
		{
			case OrderStatus.PENDING:
				return <Tag style={{minWidth:"130px",textAlign:"center"}} color={OrderHelper.GetStatusColor(orderStatus)}>Chờ xác nhận</Tag>
			case OrderStatus.CONFIRMED:
				return <Tag style={{minWidth:"130px",textAlign:"center"}} color={OrderHelper.GetStatusColor(orderStatus)}>Đã xác nhận</Tag>
			case OrderStatus.CANCELLED:
				return <Tag style={{minWidth:"130px",textAlign:"center"}} color={OrderHelper.GetStatusColor(orderStatus)}>Hủy đơn</Tag>
			case OrderStatus.DUPLICATE_NUMBER:
				return <Tag style={{minWidth:"130px",textAlign:"center"}} color={OrderHelper.GetStatusColor(orderStatus)}>Số trùng</Tag>
			case OrderStatus.UNABLE_TO_CONTACT:
				return <Tag style={{minWidth:"130px",textAlign:"center"}} color={OrderHelper.GetStatusColor(orderStatus)}>Không liên lạc được</Tag>
			case OrderStatus.HAVING_MALICIOUS_INTENT:
				return <Tag style={{minWidth:"130px",textAlign:"center"}} color={OrderHelper.GetStatusColor(orderStatus)}>Số phá hoại</Tag>
			default:
				return ""
		}
	}
	static ToProductShip(details:OrderDetail[])
	{
		if (details.length === 0)
		{
			return ""
		}
		details = details.map(e=>{
			let product = e.product
			let sku = e.sku
			if (Array.isArray(e.product))
			{
				product = e.product[0]
			}
			if (Array.isArray(e.sku))
			{
				sku = e.sku[0]
			}
			return {
				...e,
				sku: sku,
				product: product,
			}

		})
		function  renderCode(product:Product)
		{
			if (!product)
			{
				return ""
			}
			return `${product.code} -`
		}
		
		function renderSku(color:OrderDetailColor|undefined)
		{
			if (!color)
			{
				return ""
			}
			return `${color.size.code.toUpperCase()}`
		}
		
		return details?.map((e,index)=>{
			return <div key={index}>
				
			</div>
		})
	}
	static ToProduct(details:OrderDetail[])
	{
		if (details.length === 0)
		{
			return ""
		}
		details = details.map(e=>{
			let product = e.product
			let sku = e.sku
			if (Array.isArray(e.product))
			{
				product = e.product[0]
			}
			
			if (Array.isArray(e.sku))
			{
				sku = e.sku[0]
			}
			return {
				...e,
				sku: sku,
				product: product,
			}
		
		})
		function renderProduct(product:Product)
		{
			if (!product)
			{
				return ""
			}
			return `${product.code} - ${product.name} x`
		}
		
		function renderSku(color:OrderDetailColor|undefined)
		{
			if (!color)
			{
				return ""
			}
			return `- ${color.color.toUpperCase()} - ${ color.size.size.toUpperCase()} x`
		}
		return details?.map((e,index)=>{
			return <div key={index}>
				{renderProduct(e.product)}  {renderSku(e.color)} {e.quantity}
			</div>
		})
	}
	static ToProduct2(details:OrderDetail[])
	{
		details = details.map(e=>{
			let product = e.product
			let sku = e.sku
			if (Array.isArray(e.product))
			{
				product = e.product[0]
			}

			if (Array.isArray(e.sku))
			{
				sku = e.sku[0]
			}


			return {
				...e,
				sku: sku,
				product: product,
			}

		})
		function renderProduct(product:Product)
		{
			return `${product.code} - ${product.name}`
		}

		function renderSku(color:OrderDetailColor|undefined)
		{
			if (!color)
			{
				return ""
			}
			return ` - ${color.size.code}`
		}

		return details?.map((e,index)=>{
			return <div key={index}>
				{renderProduct(e.product)} x{e.quantity} {renderSku(e.color)}
			</div>
		})
	}
	static ToProductList(products:Product[])
	{
		return products?.map(e=>{
			return {
				label: `${e.code} - ${e.name}`,
				
				value: e._id,
				
				entity: e
			}
		})
	}
	
	static ToTotalQuantityInSKU(sku:SKU)
	{
		if (!sku)
		{
			return 0
		}
		return sku.colors.reduce((acc,cur)=>{
			return acc + cur.sizes.reduce((acc2,cur2)=>{
				return acc2 + cur2.quantity
			},0)
		},0)
	}
	
	
	static ToSKUList(product:Product|undefined)
	{
		if (!product)
		{
			return []
		}
		const listSku = product.skus.filter((e)=>{
			if (e.state)
			{
				return OrderHelper.ToTotalQuantityInSKU(e) > 0
			}
			return true
		})
		const result =  listSku.map(e=>{
			return {
				label: `${e.code}`,
				value: e._id,
				entity: e
			}
		})
		return result
	}
	
	static toOrderStatusOptions()
	{
		const labels:Record<string, string> = {
			[OrderStatus.PENDING]: "Chờ xác nhận",
			[OrderStatus.CONFIRMED]: "Đã xác nhận",
			[OrderStatus.CANCELLED]: "Hủy đơn",
			[OrderStatus.DUPLICATE_NUMBER]: "Số trùng",
			[OrderStatus.UNABLE_TO_CONTACT]: "Không liên lạc được",
			[OrderStatus.HAVING_MALICIOUS_INTENT]: "Số phá hoại",
		}
		return Array.from(Object.values(OrderStatus)).map(e=>{
			return {
				label: this.Status(e),
				value: e
			}
		})
	}
	
	
	static ToColorList(colors:Array<ProductColor> | undefined,sku:SKU|undefined)
	{
		if (!colors)
		{
			return []
		}
		if(!sku)
		{
			return []
		}
		
		if (sku.state)
		{
			return colors?.map(e=>{
				return {
					title: e.color,
					selectable: false,
					value: e.id,
					entity: e,
					children: e.sizes?.filter(e=>e.quantity > 0).map(ee=>{
						return {
							title:e.color+" - "+ ee.size,
							value: ee.id,
							weight: ee.weight,
							price: ee.price,
							color: e,
							size: ee,
							quantity: ee.quantity,
						}
					})
				}
			})
		}
		else
		{
			return colors?.filter(e=>{
				const totalQuantity = e.sizes.reduce((acc,cur)=>{
					return acc + cur.quantity
				},0)
				const totalReQuantity = e.sizes.reduce((acc,cur)=>{
					return acc + cur.reQuantity
				},0)
				return totalQuantity + totalReQuantity > 0
			})
			.map(e=>{
				return {
					title: e.color,
					selectable: false,
					value: e.id,
					entity: e,
					children: e.sizes?.filter(e=> e.reQuantity+e.quantity > 0).map(ee=>{
						return {
							title:e.color+" - "+ ee.size,
							value: ee.id,
							weight: ee.weight,
							price: ee.price,
							color: e,
							size: ee,
						}
					})
				}
			})
		}
		
	}
	
	static toOrderTagOptions()
	{
		const labels = {
			[OrderTag.UNCATEGORIZED]: <Tag color={"#808080"} style={{minWidth:"100px",textAlign:"center"}}>Chưa phân loại</Tag>,
			[OrderTag.IN_STOCK]: <Tag color={"#4CAF50"} style={{minWidth:"100px",textAlign:"center"}}>Còn hàng</Tag>,
			[OrderTag.OUT_OF_STOCK]: <Tag color={"#FF0000"}  style={{minWidth:"100px",textAlign:"center"}}>Hết hàng</Tag>,
		}
		return Array.from(Object.values(OrderTag)).map(e=>{
			return {
				label: labels[e],
				value: e
			}
		})
	}
	
	static toPickSessionOptions()
	{
		const labels:Record<string, string> = {
			[ShipSession.MORNING]: "Ca sáng",
			[ShipSession.AFTERNOON]: "Ca chiều",
			[ShipSession.EVENING]: "Ca tối",
		}
		return Array.from(Object.values(ShipSession)).map(e=>{
			return {
				label: labels[e],
				value: e
			}
		})
	}
	
	static toJson(data:Record<string, any>)
	{
		const result:Record<string,any> = {}
		if (data?._id)
		{
			result._id = data._id
		}
		result.status = data.status;
		result.tag = data.tag;
		result.discount = data.discount || data.discountPrice;
		result.note = data.note || "";
		result.ship = {
			to :{
				province:data.ship.to.province,
				district:data.ship.to.district,
				ward:data.ship.to.ward,
				street:data.ship.to.street || "",
				address:data.ship.to.address,
				fullName:data.ship.to.fullName,
				phone:data.ship.to.phone,
				
			},
			note:data.ship.to.note || "",
			pickUpDate: data.ship.pickUpDate ? DateUtil.format(data.ship.pickUpDate.toDate(),DateUtil.dateFormat) : undefined,
			pickSession: data.ship.pickSession,
			shiftSession: data.ship.shiftSession,
			type: data.ship.shipType,
			freeShip: data.ship.freeShip || false,
		}
		result.details = data.details.map((e:any)=>{
			return {
				_id: e._id || undefined,
				product: e.entity._id,
				sku: e.selectSku._id,
				isRetail: e.isRetail,
				quantity: e.quantity,
				color:{
					id: e.colorSelect.id,
					color: e.colorSelect.color,
					size: {
						id: e.sizeSelect.id,
						size: e.sizeSelect.size,
						price: e.sizeSelect.price,
						weight: e.sizeSelect.weight,
						importPrice: e.sizeSelect?.importPrice || 0,
					}
				}
			}
		})
		return result;
	}
	
	static toOrderDetail(data:Record<string, any>)
	{
		const result:Record<string,any> = {}
		result.details = data.details.map((e:any)=>{
			return {
				_id: e._id || undefined,
				product: e.entity._id,
				sku: e.selectSku._id,
				isRetail: e.isRetail,
				quantity: e.quantity,
				color:{
					id: e.colorSelect.id,
					color: e.colorSelect.color,
					size: {
						id: e.sizeSelect.id,
						size: e.sizeSelect.size,
						price: e.sizeSelect.price,
						weight: e.sizeSelect.weight,
						importPrice: e.sizeSelect?.importPrice || 0,
					}
				}
			}
		})
		return result;
	}
	
	static toWarning(addOnInfo:AddOnInfo)
	{
		if (!addOnInfo?.warning)
		{
			return ""
		}
		switch (addOnInfo.warning)
		{
			case OrderWarning.DUPLICATE_ORDER:
				return <Tag color={"#DC143C"}>Đơn trùng</Tag>
		}
	}
	
	static toComfirmDate(date:Date)
	{
		if (!date)
		{
			return ""
		}
		return DateUtil.format(date,DateUtil.dateFormat)
	}
	
	static toComfirmUser(user:User|undefined)
	{
		if (!user)
		{
			return ""
		}
		return user.fullName || user.username
	}
	
	static getTotal(details:Array<OrderDetail>)
	{
		return details?.reduce((acc,cur)=>{
			const isRetail = cur.isRetail || false
			const basePrice = cur?.price
			return acc + (basePrice + (cur?.color?.size?.price || 0)) * cur.quantity
		},0)
	}
}