type BaseEntity = {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
};

type Page<T extends BaseEntity> = {
    data: T[];
    meta: Meta;
    [key: string]: any;
}

type Meta = {
    total?: number;
	limit?: number;
	page?: number;
	totalPage?: number;
}

type Query = {
    limit?: number;
    page?: number;
    query?: string;
    [key: string]: any;
}

type ReactRoute = {
    path: string;
    element: React.ReactNode;
    children?: ReactRoute[];
}

type ApiException = {
    code:string;
    message:string;
    timestamp:Date;
    path:string;
    isError:boolean;
}

