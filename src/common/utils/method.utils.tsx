import React, {Suspense} from "react";
import './utils.scss'

export function  LazyLoad(component:any)
{
	return function ()
	{
		const LazyComponent = React.lazy(component);
		return (
			<Suspense fallback={<Loading />}>
				<LazyComponent />
			</Suspense>
		);
	}
}

export default function Loading() {
	return (
		<div id="waiting-loading">
			<div className="loading-container">
				<div className="loading-spinner"></div>
			</div>
		</div>
	);
}

export function OnselectRow<T>(entity:T,callback:(entity:T)=>void)
{
	return {
		onClick: () => {
			callback(entity)
		}
	}
}


export function SaveFileByBinary(data:Blob,fileName:string)
{
	// save file with binary data to local
	const url = window.URL.createObjectURL(new Blob([data],{
		type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	}));
	window.open(url);
}