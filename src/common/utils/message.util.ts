import {message} from 'antd';
import {LoggerUtil} from './logger.util';

export class MessageUtil {
    static CatchError(error: any)
    {
        if (error?.isError) {
            LoggerUtil.Error(error);
            message.error({
				type: 'error',
				content: error.message,
				duration: 5
			})
        }
    }
	static Success(str:string)
	{
		message.success({
			type: 'success',
			content: str,
			duration: 5
		})
	}
}
