import {ProductColor, ProductSize, SKU} from "@/@types/repo/sku.type.ts";
import {OrderSource} from "@/@types/order/order.type.ts";

export class SkuHelper
{
	static renderColor(colors: Array<ProductColor>)
	{
		return colors.map((color: ProductColor) => {
			return (
				<div key={color.id}>
					{color.color.toUpperCase()} - {color.sizes.map((size: ProductSize) => size.size.toUpperCase()).join(", ")}
				</div>
			)
		})
	}
	
	static renderQuantityInStock(colors: Array<ProductColor>)
	{
		return colors.reduce((total: number, color: ProductColor) => {
			return total + color.sizes.reduce((total: number, size: ProductSize) => {
				return total + size.quantity
			}, 0)
		}, 0)
	}
	
	static renderQuantityTotalImport(colors: Array<ProductColor>)
	{
		return colors.reduce((total: number, color: ProductColor) => {
			return total + color.sizes.reduce((total: number, size: ProductSize) => {
				return total + size.reQuantity
			}, 0)
		}, 0)
	}
	
	static toColorAndSizeFromSkus(skus: Array<SKU>)
	{
		const result:Record<string, Array<string>> = {}

		skus.forEach((sku: SKU) => {
			sku.colors.forEach((color: ProductColor) => {
				if (!result[color.color.toUpperCase().trim()])
				{
					result[color.color.toUpperCase().trim()] = []
				}
				color.sizes.forEach((size: ProductSize) => {
					if (result[color.color?.toUpperCase()] &&!result[color.color?.toUpperCase()]?.includes(size.size.toUpperCase().trim()))
					{
						result[color.color?.toUpperCase()]?.push(size.size.toUpperCase().trim())
					}
				})
			})
		})
		
		return Object.keys(result).map((color: string) => {
			return <div>
				{color} - {result[color].join(", ")}
			</div>
		})
		
	}
	
	
	static toSrc()
	{
		return [
			{
				label:"Việt nam",
				value:OrderSource.VIETNAM,
			},
			{
				label:"Nước ngoài",
				value:OrderSource.UNKNOWN,
			}
		]
	}
}