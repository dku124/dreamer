export enum Mode {
	AUTO = 'AUTO',
	DISABLE = 'DISABLE',
}


export type Config= BaseEntity & {
	mode:Mode;
	percent:number;
}