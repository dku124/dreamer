export class EnumUtil
{
	static toArray<T>(enumObject: any): T[]
	{
		return Object.keys(enumObject)
			.filter(key => isNaN(Number(key)))
			.map(key => enumObject[key]);
	}
}