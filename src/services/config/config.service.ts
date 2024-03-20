import AxiosClient from "@/common/providers/AxiosClient";
import {Config} from "@/@types/config/config.type.ts";

const END_POINT = "/config";
const ConfigService = {
	get:async () => {
		return await AxiosClient.get<Config,Config>(`${END_POINT}/`);
	},
	update:async (data: Config) => {
		return await AxiosClient.put<Config,Config>(`${END_POINT}/`,data);
	}
}
export default ConfigService;