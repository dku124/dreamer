import {useEffect} from 'react';

const useInterval = (callback:Function, delay:number) => {
	useEffect(() => {
		const intervalId = setInterval(callback, delay);

		// Cleanup function to clear the interval when the component unmounts
		return () => clearInterval(intervalId);
	}, [callback, delay]);
};

export default useInterval;