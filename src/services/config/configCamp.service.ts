import AxiosClient from "@/common/providers/AxiosClient";
import {ConfigCamp} from "@/@types/config/configCamp.type.ts";

const END_POINT = "/config-camp";
const ConfigCamService = {
	getPage:async (query:Query) => {
		return await AxiosClient.get<Page<ConfigCamp>,Page<ConfigCamp>>(`${END_POINT}`,{
			params:query
		});
	},
	create:async (data: Partial<ConfigCamp>) => {
		return await AxiosClient.post<ConfigCamp,ConfigCamp>(`${END_POINT}`,data);
	},
	update:async (data: Partial<ConfigCamp>) => {
		return await AxiosClient.put<ConfigCamp,ConfigCamp>(`${END_POINT}/${data._id}`,data);
	},
	delete:async (data: Partial<ConfigCamp>) => {
		return await AxiosClient.delete<ConfigCamp,ConfigCamp>(`${END_POINT}/${data._id}`);
	},
}
export default ConfigCamService;