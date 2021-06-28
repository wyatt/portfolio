import {CurrentSongType} from '../types/types';
import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

export const CurrentSong = (props: {song: CurrentSongType}) => {
	return (
		<CurrentSongContainer>
			<AlbumCover src={props.song.album_cover} alt={`${props.song.name} album cover`} />
			<div>
				<SongName href={props.song.href}>{props.song.name}</SongName>
				<SongArtist>{props.song.artist}</SongArtist>
			</div>
		</CurrentSongContainer>
	);
};

const CurrentSongContainer = styled.div`
	max-height: 68px;
	${tw`text-white flex items-center space-x-3 m-3`}
`;

const SongName = tw.a`font-semibold md:text-lg text-base hover:underline w-52 flex`;
const SongArtist = tw.p`md:text-base text-sm`;

const AlbumCover = (props: {src: string; alt: string}) => (
	<Image src={props.src} alt={props.alt} width={60} height={60} tw={'rounded-lg'} />
);
