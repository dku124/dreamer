import AxiosClient from "@/common/providers/AxiosClient";
import {Noti} from "@/@types/noti/noti.type.ts";

const END_POINT = "/noti";
const NotiService = {
	getById:async (id:string) => {
		return await AxiosClient.get<Noti,Noti[]>(`${END_POINT}/${id}`);
	}
}
export default NotiService;