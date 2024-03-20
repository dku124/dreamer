import {ProductUnit} from "@/@types/repo/product-unit.type.ts";

export class ProductUnitHelper
{
	static render(productUnit:ProductUnit)
	{
		return productUnit.name
	}
	
	static toOption(productUnit:ProductUnit)
	{
		return {
			value: productUnit._id,
			label: productUnit.name
		}
	}
	
	static toOptions(productUnits:ProductUnit[])
	{
		return productUnits.map(ProductUnitHelper.toOption)
	}
}