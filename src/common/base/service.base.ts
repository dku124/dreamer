import AxiosClient from "@providers/AxiosClient.ts";

export interface BaseService<T extends BaseEntity> {
	getPage:(query:Query|T)=>Promise<Page<T>>,
	getDetail:(data:any)=>Promise<T>,
	update:(data:any)=>Promise<T>,
	delete:(data:any)=>Promise<T>,
	create:(data:any)=>Promise<T>,
	list:()=>Promise<T[]>,
	[key:string]:any
}


export function baseService<T extends BaseEntity>(path:string) : BaseService<T>
{
	return {
		getPage:(query:Query|undefined)=>{
			return AxiosClient.get<T,Page<T>>(path,{
				params:query
			})
		},
		getDetail:(data:Partial<T>)=>{
			return AxiosClient.get<T,T>(`${path}/${data._id}`)
		},
		update:(data:Partial<T>)=>{
			return AxiosClient.put<T,T>(`${path}/${data._id}`,data)
		},
		delete:(data:Partial<T>)=>{
			return AxiosClient.delete<T,T>(`${path}/${data._id}`)
		},
		create:(data:Partial<T>)=>{
			return AxiosClient.post<T,T>(`${path}/`,data)
		},
		list:()=>{
			return AxiosClient.get<T,T[]>(`${path}/list`)
		},
	}
}

export default baseService;