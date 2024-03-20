import AxiosClient from "@/common/providers/AxiosClient";
import {ConfigUnit} from "@/@types/config/configUnit.type.ts";

const END_POINT = "/config-unit";
const ConfigUnitService = {
	getPage:async (query:Query) => {
		return await AxiosClient.get<Page<ConfigUnit>,Page<ConfigUnit>>(`${END_POINT}`,{
			params:query
		});
	},
	getList:async () => {
		return await AxiosClient.get<ConfigUnit[],ConfigUnit[]>(`${END_POINT}/get/list`);
	},
	create:async (data: Partial<ConfigUnit>) => {
		return await AxiosClient.post<ConfigUnit,ConfigUnit>(`${END_POINT}`,data);
	},
	update:async (data: Partial<ConfigUnit>) => {
		return await AxiosClient.put<ConfigUnit,ConfigUnit>(`${END_POINT}/${data._id}`,data);
	},
	delete:async (data: Partial<ConfigUnit>) => {
		return await AxiosClient.delete<ConfigUnit,ConfigUnit>(`${END_POINT}/${data._id}`);
	},
}
export default ConfigUnitService;