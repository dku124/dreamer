import {UserRole} from "@/@types/user.type";
import {Badge, Tag} from "antd";

export class RoleHelper {
	static toName(role: UserRole,index:number = 0) {
		switch (role) {
			case UserRole.ACCOUNTANT:
				return <Tag style={{minWidth:"85px",textAlign:"center"}} key={index} color={"#27ae60"}>Kế toán</Tag>;
			case UserRole.ADMIN:
				return <Tag style={{minWidth:"85px",textAlign:"center"}}  key={index} color={"#3498db"}>Quản trị viên</Tag>;
			case UserRole.MARKETING:
				return <Tag style={{minWidth:"85px",textAlign:"center"}}  key={index} color={"#e74c3c"}>Marketing</Tag>;
			case UserRole.TELE_SALE:
				return <Tag style={{minWidth:"85px",textAlign:"center"}}  key={index} color={"#e67e22"}>Sale</Tag>;
			case UserRole.WAREHOUSE:
				return <Tag style={{minWidth:"85px",textAlign:"center"}}  key={index} color={"#2ecc71"}>Kho</Tag>;
			case UserRole.DELIVERY:
				return <Tag style={{minWidth:"85px",textAlign:"center"}}  key={index} color={"#FF9999"}>Vận đơn</Tag>;
			case UserRole.LEADER:
				return <Tag  style={{minWidth:"85px",textAlign:"center"}}  key={index} color={"#FFA500"}>Leader</Tag>;
			default:
				return "";
		}
	}
	static toNameForNoti(role: string,count:number = 0) {
		return (
			<Badge count={count} offset={[0, 0]}>
				{RoleHelper.toName(role as UserRole)}
			</Badge>
		)
		
	}
	
	
	static join(roles: UserRole[]) {
		return roles.map(RoleHelper.toName)
	}
	
	static toSelect() {
		return Object.keys(UserRole).map((key,index) => {
			return {
				label: RoleHelper.toName(UserRole[key as keyof typeof UserRole],index),
				value: UserRole[key as keyof typeof UserRole],
			}
		})
	}
}