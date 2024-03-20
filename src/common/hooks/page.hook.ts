import {useState} from 'react';

export function PageAble(props:Query)
{
    const defaultPageable = {
        limit:10 ?? props.limit,
        page:1 ?? props.page,
        query:'' ?? props.query
    };
    const [pageable, setPageable] = useState<Query>(defaultPageable);
    const onChange = (e:Partial<Query>) => {
        setPageable({...pageable,e});
    }
    return [pageable, onChange]
}

export function useQuery(props?: Query): [Partial<Query> & typeof props, (e: Partial<Query>) => void] {
	const defaultPageable = {
		limit: props?.limit || 10,
		page: props?.page || 1,
		query: props?.query || "" ,
	};
	const [pageable, setPageable] = useState<Partial<Query>>({
		...props,
		...defaultPageable,
	});
	const onChange = (e: Partial<Query>) => {
		setPageable({...pageable, ...e});
	}
	return [pageable, onChange]
}
