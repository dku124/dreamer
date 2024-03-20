import AxiosClient from "@/common/providers/AxiosClient";
import {User, UserRole} from "@/@types/user.type.ts";

const END_POINT = "/admin";

const AdminService = {
	getPage:(query:Query|undefined)=>{
		return AxiosClient.get<User,Page<User>>(END_POINT,{
			params:query
		})
	},
	createUser:(user:Partial<User>)=>{
		return AxiosClient.post<User,User>(END_POINT,user)
	},
	updateUser:(user:Partial<User>)=>{
		return AxiosClient.put<User,User>(`${END_POINT}/${user._id}`,user)	
	},
	updateStatus:(user:Partial<User>)=>{
		return AxiosClient.put<User,User>(`${END_POINT}/update-status/${user._id}`,user)	
	}	,
	updatePassword:(user:Partial<User>)=>{
		return AxiosClient.put<User,User>(`${END_POINT}/update-password/${user._id}`,user)	
	},
	getUserByRole:(roles:UserRole[])=>{
		return AxiosClient.get<User,User[]>(`${END_POINT}/get/byRole/`,{
			params:{
				roles:roles
			}
		})
	}
}
export default AdminService