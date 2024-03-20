import {notification} from "antd";

export class AlertUtil{
	static Success(str:string)
	{
		notification.success({
			message: "Thành công",
			description: str,
			duration: 3
		})
	}
	
	static Error(str:string)
	{
		notification.error({
			message: "Thất bại",
			description: str,
			duration: 3
		})
	}
	
	static CatchError(error: any)
	{
		if(error?.statusCode || error?.isError || error?.message || error?.code)
		{
			notification.error({
				message: "Thất bại",
				description: error.message,
				duration: 3
			})
		}
	}
	
	static Warning(str:string)
	{
		notification.warning({
			message: "Cảnh báo",
			description: str,
			duration: 3
		})
	}
}