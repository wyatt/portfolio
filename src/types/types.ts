export interface GradientColors {
	colors: {color: string; position: string}[];
}

export interface CurrentSongType {
	id: string;
	name: string;
	artist: string;
	href: string;
	album_cover: string;
}

export type SpotifyResponse = SpotifyResponseGood | SpotifyResponseBad;

interface SpotifyResponseGood {
	message: {
		song: CurrentSongType;
		gradient: GradientColors;
	};
	success: true;
}

interface SpotifyResponseBad {
	message: null;
	success: false;
}
