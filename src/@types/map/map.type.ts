export type MapLevel3s = {
	level3_id: string;
	name: string;
	type: string;
}
export type MapLevel2s = {
	level2_id: string;
	name: string;
	type: string;
	level3s: MapLevel3s[];
}
export type MapLevel1s = {
	level1_id: string;
	name: string;
	type: string;
	short_name: string;
	color: string;
	level2s: MapLevel2s[];
}