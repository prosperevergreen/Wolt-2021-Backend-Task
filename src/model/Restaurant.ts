export default interface Restaurant {
	blurhash: string;
	launch_date: string;
	location: Array<number>; // [number, number] Gives error
	name: string;
	online: boolean;
	popularity: number;
}