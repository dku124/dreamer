import {OrderDetail} from "@/@types/order/detail.type";
import {Customer} from "@/@types/repo/customer.type";
import {NumberUtil} from "../utils/number.util";
import {Product} from "@/@types/repo/product.type";
import {Order, OrderStatus} from "@/@types/order/order.type";
import {DateUtil} from "../utils/date.util";
import {Typography} from "antd";

export class CustomerHelper {
  
    static totalMoney(data:Customer) {
        let total = data.orders.reduce((total,order) => {
			if (order.status !== OrderStatus.CONFIRMED)
			{
				return  total
			}
			return total + order.details.reduce((total, detail) => {
				if(detail && detail.sku)
				{
					if(detail && detail.sku && detail.color)
					{
						return total + ((detail.price + (detail.color?.size?.price || 0)) * detail.quantity)
					}
					return total;
				}
				return total + 1;
			},0)
            
        },0)
		let totalPre = data.preOrders.reduce((total,order) => {
			order.details.forEach((detail) => {
				total += (detail.quantity || 0) * (detail.price || 0)
			})
			return total;
		},0)
        return <div>
            {NumberUtil.toNumberMoney(total + totalPre)}
        </div>
    }

    static totalProductBuy(data:Customer) {
        let total = data.orders.reduce((total,order) => {
            return total + order.details.reduce((total, detail) => {
				if(detail && detail.sku)
				{
					return total + (detail.quantity || 0)
				}
				return total + 1;
			},0)
        },0)
        let totalPre = data.preOrders.reduce((total,order) => {
			order.details.forEach((detail) => {
				total += (detail.quantity || 0)
			})
			return total;
		},0)
        return <div>
            {NumberUtil.toNumberMoney(total + totalPre)}
        </div>
    }

    static productBuy(data:Customer) {
        const arr = data.orders.map((order) => {
            const detail = order.details as unknown as OrderDetail;
            if(detail && detail.sku)
            {
                const product = detail.product as unknown as Product[];
               if (product[0]?.name)
			   {
				   return <div>{product[0].name} x{detail.quantity}</div>
			   }
			   return <div></div>
            }
            return <div></div>
        })
		const arrPre = data.preOrders.map((order) => {
			const arr = order.details.map((detail) => {
				return <div>{detail.productName} x{detail.quantity}</div>
			})
			return arr;
		})
		return <div>
			{arr}
			{arrPre.flat()}
		</div>
    }

    static product = (data:Order) => {
		if ((data as any).preOrder)
		{
			const preData = ((data) as any).detailsPre
			return  preData?.map((detail:any) => {
				return <div>{detail.productName} </div>
			})
		}
        return data?.details?.map((detail:OrderDetail) => {
            const  product = detail.product as unknown as Product[];
            return <div>{product[0].name} </div>
        })
    }

    static totalMoneyOrder = (data:Order) => {
		let preTotal = 0;
		if ((data as any).preOrder)
		{
			const preData = ((data) as any).detailsPre
			preTotal +=  preData?.reduce((total:number,detail:any) => {
				return total + (detail.price * detail.quantity)
			},0)
		}
        let total = data.details.reduce((total:number,detail:OrderDetail) => {
            if(detail && detail.sku && detail.color)
            {
               return total + ((detail.price + detail.color?.size?.price) * detail.quantity)
            }
            return total;
        },0)
        return <div>
            {NumberUtil.toNumberMoney(total + preTotal)}
        </div>
    }

    static qualityOrder = (data:Order) => {
		if ((data as any).preOrder)
		{
			const preData = ((data) as any).detailsPre
			return  preData?.map((detail:any) => {
				return <div>{detail.quantity} </div>
			})
		}
        return data.details.reduce((total:number,detail:OrderDetail) => {
            if(detail && detail.sku)
            {
               return total + detail.quantity
            }
            return total;
        },0)
    }

    static dayBuy = (data:Order) => {
        return <div>{
                DateUtil.format(data.createdAt,"hh:mm:ss DD/MM/YYYY")
            }</div>
    }

	static uploadPath(product:Customer)
	{
		return `${import.meta.env.VITE_API_HOST}uploads/${product.addOnInfo?.img?.replace("\\","/")}`
	}
	
	// tỉ lệ nhận
	static rateReceive = (data:Customer) => {
		let preTotal = data.preOrders?.length || 0;
		let total = data.orders.reduce((total:number,order:Order) => {
			if (order.status === OrderStatus.CONFIRMED)
			{
				return total + 1;
			}
			return total;
		},0)
		return <div>
			{NumberUtil.toNumberMoney((total + preTotal) / (data.orders?.length + preTotal) * 100)}%
		</div>
	}
	
	// tỉ lệ hủy
	static rateCancel = (data:Customer) => {
		if (data.orders?.length === 0)
		{
			return <Typography.Text type={"danger"}>0%</Typography.Text>
		}
		let total = data.orders.reduce((total:number,order:Order) => {
			switch (order.status) {
				case OrderStatus.CANCELLED:
				case OrderStatus.HAVING_MALICIOUS_INTENT:
				case OrderStatus.UNABLE_TO_CONTACT:
				case OrderStatus.DUPLICATE_NUMBER:
					return total + 1;
				default:
					return total;
			}
		},0)
		return <Typography.Text type={"danger"}>
			{NumberUtil.toNumberMoney((total ) / ((data.orders?.length ||0 ) +data.preOrders?.length ||0)* 100)}%
		</Typography.Text>
	}
	
	static toCustomerType()
	{
		return [
			"#00b63e",
			"#0070f4",
		]
	}
}