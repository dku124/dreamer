import {ConfigUnit} from "@/@types/config/configUnit.type.ts";

export class ConfigHelper
{
	static toConfigUnit(e:ConfigUnit)
	{
		return {
			label: e.key,
			value: e._id
		}
	}
	
	static toConfigUnits(e?:Array<ConfigUnit>)
	{
		return e?.map(this.toConfigUnit)
	}
}