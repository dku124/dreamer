import {Category} from "@/@types/repo/category.type.ts";

export class CategoryHelper
{
	static render(category:Category)
	{
		return category.name
	}
	
	static toOption(category:Category)
	{
		return {
			value: category._id,
			label: category.name
		}
	}
	
	static toOptions(categories:Category[])
	{
		return categories.map(CategoryHelper.toOption)
	}
}