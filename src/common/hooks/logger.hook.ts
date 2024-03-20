import {LoggerUtil} from "../utils/logger.util";

export function useLogger(context:any)
{
    const logger = new LoggerUtil(context);
    return logger;
}