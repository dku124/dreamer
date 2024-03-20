import {RoleHelper} from "@/common/helpers/role.helper.tsx";
import {authSelector} from "@/common/store/auth/auth.slice";
import {Modal, ModalProps, Typography} from "antd";
import {useSelector} from "react-redux";

export function UserInfoModal(props:Partial<ModalProps>)
{
	const auth = useSelector(authSelector);
	return (
		<Modal {...props} okButtonProps={{
			style:{
				display:'none'
			}
		}} >
			<div>
				<Typography.Text strong>
					Tên đầy đủ : {auth?.user?.fullName}
				</Typography.Text>
				<br/><br/>
				<Typography.Text strong >
					Username : {auth?.user?.username}
				</Typography.Text>
				<br/><br/>
				<Typography.Text strong>
					Quyền : {RoleHelper.join(auth?.user?.roles || [])}
				</Typography.Text>
			</div>
		</Modal>
	)
}