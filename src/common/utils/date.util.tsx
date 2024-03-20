import moment from "moment";
import {Button, Space} from "antd";

export class DateUtil{
	static dateFormat = 'DD/MM/YYYY';
	static toLocaleString(date:Date)
	{
		// cover date to string format hh:mm:ss dd/mm/yyyy
		date = new Date(date);
		const day = date.getDate();
		const month = date.getMonth()+1;
		const year = date.getFullYear();
		const hour = date.getHours();
		const minute = date.getMinutes();
		const second = date.getSeconds();
		return `${hour}:${minute}:${second} ${day}/${month}/${year}`;
	}
	static getNowDateByFormat(format:string)
	{
		return moment().format(format);
	}
	// lấy ngày mai 
	static getTomorrowDate()
	{
		const now = new Date();
		now.setDate(now.getDate()+1);
		return moment(now).format(DateUtil.dateFormat);
	}
	
	static format(date:Date |undefined,format:string = DateUtil.dateFormat)
	{
		if (!date)
		{
			date = new Date();
		}
		else
		{
			date = new Date(date);
		}
		
		return moment(date).format(format);
	}
	
	static toDate(date:string,format:string = DateUtil.dateFormat)
	{
		return moment(date,format).toDate();
	}
	
	static DatePickerFooter = (onChange:any) => {
		// hôm nay , hôm qua , 7 ngày truớc , 30 ngày trước , tháng này , tháng trước
		
		const OnPickDate = (from:string,to:string) => {
			return () => {
				onChange({
					from:from,
					to:to
				})
			}
		}
		
		// hôm nay
		const getDateToday = () => {
			const now = new Date();
			return DateUtil.format(now,DateUtil.dateFormat);
		}
		
		// hôm qua
		const getDateYesterday = () => {
			const now = new Date();
			now.setDate(now.getDate()-1);
			return DateUtil.format(now,DateUtil.dateFormat);
		}
		
		// 7 ngày trước
		const getDate7DaysAgo = () => {
			const now = new Date();
			now.setDate(now.getDate()-7);
			return DateUtil.format(now,DateUtil.dateFormat);
		}
		
		// 30 ngày trước
		const getDate30DaysAgo = () => {
			const now = new Date();
			now.setDate(now.getDate()-30);
			return DateUtil.format(now,DateUtil.dateFormat);
		}
		
		// tháng này
		const getDateThisMonth = () => {
			const now = new Date();
			const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
			const endDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
			return {
				from:DateUtil.format(firstDay,DateUtil.dateFormat),
				to:DateUtil.format(endDay,DateUtil.dateFormat)
			}
		}
		
		// tháng trước
		const getDateLastMonth = () => {
			const now = new Date();
			const firstDay = new Date(now.getFullYear(), now.getMonth()-1, 1);
			const endDay = new Date(now.getFullYear(), now.getMonth(), 0);
			return {
				from:DateUtil.format(firstDay,DateUtil.dateFormat),
				to:DateUtil.format(endDay,DateUtil.dateFormat)
			}
		}
		
		
		return (
			<Space.Compact>
				<Button size={"small"} onClick={OnPickDate(getDateToday(),getDateToday())}>Hôm nay</Button>
				<Button size={"small"} onClick={OnPickDate(getDateYesterday(),getDateYesterday())}>Hôm qua</Button>
				<Button size={"small"} onClick={OnPickDate(getDate7DaysAgo(),getDateToday())}>7 ngày trước</Button>
				<Button size={"small"} onClick={OnPickDate(getDate30DaysAgo(),getDateToday())}>30 ngày trước</Button>
				<Button size={"small"} onClick={OnPickDate(getDateThisMonth().from,getDateThisMonth().to)}>Tháng này</Button>
				<Button size={"small"} onClick={OnPickDate(getDateLastMonth().from,getDateLastMonth().to)}>Tháng trước</Button>
			</Space.Compact>
		)
	}
	
	static getDateThisMonth()
	{
		const now = new Date();
		const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
		const endDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
		return {
			from:DateUtil.format(firstDay,DateUtil.dateFormat),
			to:DateUtil.format(endDay,DateUtil.dateFormat)
		}
	}
	
	static toCreateAt(date:Date | string | undefined)
	{
		if (!date)
		{
			date = new Date();
		}
		else
		{
			date = new Date(date);
		}
		if (typeof date === "string")
		{
			date = new Date(date);
		}
		return moment(date).format(DateUtil.dateFormat);
	}
}