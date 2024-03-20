import {JwtResponse, User} from "@/@types/user.type";
import AxiosClient from "@/common/providers/AxiosClient";

const END_POINT = "/user";
const UserService = {
	login:async (data: Pick<User,'username'|'password'>) => {
		return await AxiosClient.post<User,JwtResponse>(`${END_POINT}/login`, data);
	},
	me:async () => {
		return await AxiosClient.get<User,User>(`${END_POINT}/me`);
	}
}
export default UserService;