import {User, UserStatus} from "@/@types/user.type.ts";
import {Tag} from "antd";

export class UserHelper
{
	static toStatus(status:UserStatus)
	{
		switch(status)
		{
			case UserStatus.ACTIVE:
				return <Tag style={{minWidth:"75px",textAlign:"center"}} color="green">Hoạt động</Tag>;
			case UserStatus.INACTIVE:
				return <Tag style={{minWidth:"75px",textAlign:"center"}} color="red">Bị khóa</Tag>;
			default:
				return "";
		}
	}
	
	static toListUser(users:User[])
	{
		return users.map(user => {
			return {
				label: <Tag>{user.fullName}</Tag>,
				value: user._id
			}
		})
	}
}