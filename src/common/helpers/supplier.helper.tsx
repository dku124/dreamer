import {Typography} from "antd";
import {Supplier} from "@/@types/repo/supplier.type.ts";

export class SupplierHelper{
	static toPhones(phones:Array<string>){
		return phones?.map((phone,index)=>{
			return <div key={index}>
				<Typography.Text>{phone}</Typography.Text>
			</div>
		})
	}
	
	static toOption(supplier:Supplier){
		return {
			value:supplier._id,
			label:supplier.name
		}
	}
	
	static toOptions(suppliers:Array<Supplier>){
		return suppliers?.map(SupplierHelper.toOption)
	}
}