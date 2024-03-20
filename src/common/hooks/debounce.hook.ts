import {useCallback, useRef} from "react";

export function useDebounce(fn:Function, delay:number = 300) {
	const timer = useRef<any>(null);
	return useCallback((...args:any[]) => {
		if (timer.current) {
			clearTimeout(timer.current);
		}
		timer.current = setTimeout(() => {
			fn(...args);
		}, delay);
	}, [fn, delay]);
}