export default interface Event {
	id: string;
	date: Date;
	title: string;
	description: string;
	type: string;
	popularity: string;
	popularityCount: number;
	location: string;
	duration: number;
}