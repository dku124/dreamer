export class StringUtil
{
    public static PadLeft(value: any, length: number = 2, padChar: string = '0'): string
    {
        if (value === null || value === undefined) return '';
        value = value.toString();
        return (padChar.repeat(length) + value).substr(-length);
    }

    public static PadRight(value: any, length: number = 2, padChar: string = '0'): string
    {
        if (value === null || value === undefined) return '';
        value = value.toString();
        return (value + padChar.repeat(length)).substr(0, length);
    }

    public static ToNumberString(str:any)
    {
        if(str === null || str === undefined) return '';
        str = str.toString();
        // chuyển đổi số thành chuỗi số có định dạng số ngăn cách bởi dấu chấm
        return str.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    public static RemoveChar(str:any, char:string)
    {
        if(str === null || str === undefined) return '';
        while(str.indexOf(char) > -1)
        {
            str = str.replace(char, '');
        }
        return str;
    }
    
	public static ReplaceAll(str: string, search: string, replace: string): string
	{
		if (str === null || str === undefined) return '';
		while (str.indexOf(search) > -1)
		{
			str = str.replace(search, replace);
		}
		return str;
	}
	
	
	public static GetDataByRegex(str: string, regex: RegExp ,index:number=0): string
	{
		let match = str.match(regex);
		if (match === null) return '';
		return match[index];
	}
}