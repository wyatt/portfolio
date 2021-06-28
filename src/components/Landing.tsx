import {RiInformationLine} from 'react-icons/ri';
import React, {ReactNode} from 'react';
import {IconType} from 'react-icons';
import Link from 'next/link';
import TextLoop from 'react-text-loop';
import useSWR from 'swr';
import {SpotifyResponse} from '../types/types';
import {fetcher} from '../helper/fetcher';
import {CurrentSong} from './CurrentSong';
import tw from 'twin.macro';

// Primary components
export const FlexSpacer = () => <div css={{height: '68px'}} tw="m-3" />;
export const Footer = () => {
	const {data} = useSWR<SpotifyResponse>('/spotify', fetcher);
	if (data?.success)
		return (
			<FooterContainer>
				<CurrentSong song={data.message.song} />
				<SongExplainer />
			</FooterContainer>
		);
	return <FlexSpacer />;
};

//Containers
const FooterContainer = tw.div`flex justify-between align-bottom`;
export const PrimaryContainer = tw.div`flex flex-col items-center space-y-5`;
export const NameAndCarousel = tw.div`text-center space-y-3`;
export const ButtonsContainer = (props: {children: ReactNode}) => (
	<div tw="flex transition space-x-3" className={'animate__animated animate__delay-1s animate__zoomIn'}>
		{props.children}
	</div>
);

// Main Content Components
export const Name = (props: {children: ReactNode}) => (
	<h1 className={'animate__animated animate__zoomInDown'} tw="text-white lg:text-8xl text-6xl font-bold text-center">
		{props.children}
	</h1>
);

export const Carousel = (props: {phrases: string[]}) => (
	<TextLoop
		tw="text-white text-lg lg:text-2xl font-semibold opacity-80"
		className={'animate__animated animate__delay-2s animate__fadeIn'}
		interval={2000}
		mask={true}
	>
		{props.phrases.map(s => (
			<p tw="w-72" key="s">
				{s}
			</p>
		))}
	</TextLoop>
);

export const Button = (props: {children: ReactNode; href?: string}) => {
	return <ButtonLink href={props.href}>{props.children}</ButtonLink>;
};

export const SeeMyWorkButton = (props: {href: string; children: ReactNode}) => (
	<Link href={props.href} passHref>
		<ButtonLink>{props.children}</ButtonLink>
	</Link>
);

const ButtonLink = tw.a`bg-black text-sm md:text-base bg-opacity-20 py-3 w-32 md:w-40 items-center justify-center text-white font-medium rounded-lg transition transform hover:scale-110 hover:shadow-2xl opacity-80 cursor-pointer flex items-center whitespace-pre`;

export const IconsContainer = tw.div`flex space-x-2`;

export const Icon = (props: {icon: IconType; href: string}) => (
	<IconLink href={props.href} className={'animate__animated animate__delay-2s animate__fadeIn'}>
		{props.icon({color: 'white', size: '2.25em'})}
	</IconLink>
);

const IconLink = tw.a`transform hover:scale-110 transition flex rounded-lg`;

// Secondary Components
const SongExplainerLink = tw.a`flex items-end text-white m-3 text-3xl transform transition hover:scale-110`;
const SongExplainer = () => (
	<SongExplainerLink href="https://wyattsell.medium.com/the-making-of-my-portfolio-website-5d204b018649">
		<RiInformationLine />
	</SongExplainerLink>
);
