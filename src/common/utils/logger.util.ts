import {LoggerType} from '@/common/enums/loggerType.enum';
import {StringUtil} from './string.util';

export class LoggerUtil {
    private static isEnable: boolean = true;
    private context:string;
    private static readonly console: Console = console;
    private static readonly DEFAULT_CONTEXT: string = 'LoggerUtil';
    constructor(name:any) 
    {
        if(name instanceof Function)
        {
            name = name.name;
        }
        this.context = name;
    }
    private static timestamp(): string {
        const date: Date = new Date();
        return `${StringUtil.PadLeft(date.getHours())}:${StringUtil.PadLeft(date.getMinutes())}:${StringUtil.PadLeft(date.getSeconds())}`;
    }
    private static getColor(type:LoggerType|string):string
    {
        switch(type)
        {
            case LoggerType.ERROR:
                return '#FF0000';
            case LoggerType.INFO:
                return '#00CC00';
            case LoggerType.WARNING:
                return '#FFFF00';
            case LoggerType.LOG:
                return '#00CC00';
            default:
                return '#00CC00';
        }
    }
    private static getTimeColor():string
    {
        return '#fff';
    }
    public static Disable(): void {
        this.isEnable = false;
    }
    private static writeWithFormat(context:string,type:LoggerType,...message:any)
    {
        if(!this.isEnable) return;
        const flag = context === this.DEFAULT_CONTEXT;
        this.console.log(`%c[${this.DEFAULT_CONTEXT}] > %c${this.timestamp()}%c < ${type} %c[${flag ? 'STATIC':context}] `, 
        `color: ${this.getColor(type)}`, 
        `color: ${this.getTimeColor()}`, 
        `color: ${this.getColor(type)}`, 
        `color: #FFFF00`,...message);
    }
    public static Log(...message:any):void
    {
        this.writeWithFormat(this.DEFAULT_CONTEXT,LoggerType.LOG,...message);
    }
    public static Info(...message:any):void
    {
        this.writeWithFormat(this.DEFAULT_CONTEXT,LoggerType.INFO,...message);
    }
    public static Warning(...message:any):void
    {
        this.writeWithFormat(this.DEFAULT_CONTEXT,LoggerType.WARNING,...message);
    }
    public static Error(...message:any):void
    {
        this.writeWithFormat(this.DEFAULT_CONTEXT,LoggerType.ERROR,...message);
    }
    public log(...message:any):void
    {
        if(!LoggerUtil.isEnable) return;
        LoggerUtil.writeWithFormat(this.context,LoggerType.LOG,...message);
    }
    public info(...message:any):void
    {
        if(!LoggerUtil.isEnable) return;
        LoggerUtil.writeWithFormat(this.context,LoggerType.INFO,...message);
    }
    public warning(...message:any):void
    {
        if(!LoggerUtil.isEnable) return;
        LoggerUtil.writeWithFormat(this.context,LoggerType.WARNING,...message);
    }
    public error(...message:any):void
    {
        if(!LoggerUtil.isEnable) return;
        LoggerUtil.writeWithFormat(this.context,LoggerType.ERROR,...message);
    }
}