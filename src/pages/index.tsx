import {Heading} from '@chakra-ui/layout';
import {
	AspectRatio,
	Button,
	Container,
	Flex,
	keyframes,
	Link,
	Stack,
	Tag,
	Text,
	VStack,
	Image,
	UnorderedList,
	Avatar,
	HStack,
	Divider,
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import {useLastFM} from 'use-last-fm';
import {usePalette} from 'color-thief-react';
import {tinycolor} from '@ctrl/tinycolor';
import {Fragment, useEffect, useState} from 'react';
import NextImage from 'next/image';

export default function Home() {
	const [fullName, setFullName] = useState(false);

	return (
		<Container
			pt={[8, 20]}
			pb={[8, 20]}
			px={[4, 4, 4, 0]}
			maxW={'container.md'}
			minH={'100vh'}
		>
			<VStack w={'full'} spacing={'none'} textAlign={'left'}>
				<VStack alignItems={'flex-start'}>
					<Stack
						direction={['column', 'row']}
						justifyContent={'space-between'}
						w={'full'}
					>
						<HStack>
							<VStack alignItems={'flex-start'}>
								<Heading
									mb={2}
									onMouseEnter={() => {
										setFullName(true);
									}}
									onMouseLeave={() => {
										setFullName(false);
									}}
									display={'flex'}
									whiteSpace={'nowrap'}
								>
									Hey, I’m Wyatt&nbsp;
									<Text
										as={'span'}
										width={fullName ? '100%' : 0}
										transition={'width 0.4s ease-in-out'}
										overflow={'hidden'}
										display={'inline-block'}
										height={'1lh'}
									>
										Sell&nbsp;
									</Text>
									<WavingEmoji>👋</WavingEmoji>
								</Heading>

								<SpotifyTag />
							</VStack>
						</HStack>
						<Button
							colorScheme={'gray'}
							variant={'ghost'}
							as={Link}
							href={'mailto:wyattsetonsell@gmail.com'}
							textDecoration={'underline'}
							_hover={{
								backdropFilter: 'brightness(0.95)',
							}}
						>
							Send me an email
						</Button>
					</Stack>
					<HStack pb={2} alignItems={'flex-start'} w={'full'} fontSize={18}>
						<Link
							href={'https://github.com/wyatt'}
							textDecoration={'underline'}
						>
							Github
						</Link>
						<Divider
							orientation={'vertical'}
							height={'1lh'}
							borderColor={'gray.600'}
						/>
						<Link
							href={'/assets/Wyatt_Sell_Resume.pdf'}
							textDecoration={'underline'}
						>
							Resumé
						</Link>
						<Divider
							orientation={'vertical'}
							height={'1lh'}
							borderColor={'gray.600'}
						/>
						<Link
							href={'https://www.linkedin.com/in/wyattsell/'}
							textDecoration={'underline'}
						>
							LinkedIn
						</Link>
					</HStack>
					<VStack fontSize={24} lineHeight={1.6} spacing={4}>
						<Text>
							I’m studying Electrical and Computer Engineering (ECE) at Cornell
							University with plans to minor in English. In my free time, I
							enjoy writing software, running, and reading history, philosophy
							and literature. I’m interested in computational epistemology and
							in how we can better use technology to interpret knowledge and
							augment our cognitive abilities. My latest project (
							<Link textDecoration={'underline'} href={'https://maxims.app'}>
								maxims.app
							</Link>
							) is a tool for visualizing text embeddings on a 2D canvas, to
							allow you to explore how various ideas, quotes, and concepts
							relate to each other.
						</Text>
						<Text>＊&nbsp;&nbsp;＊&nbsp;&nbsp;＊</Text>
						<Text>
							I've worked on a wide array of projects and teams, including:
							<UnorderedList mt={3}>
								<li>
									<Link
										href={'https://revisio.app'}
										textDecoration={'underline'}
									>
										Remnote (team)
									</Link>
									: A note-taking and spaced-repetition platform that helps you
									to remember more of what you learn.
								</li>
								<li>
									<Link
										href={'https://revisio.app'}
										textDecoration={'underline'}
									>
										Revisio (solo)
									</Link>
									: A full-stack SaaS that helps students revise for exam better
									using algorithms and collaboration
								</li>
								<li>
									<Link
										href={'https://revisio.app'}
										textDecoration={'underline'}
									>
										Samaritan Scout (team)
									</Link>
									: The web's first search engine for volunteer oppurtunities,
									leveraging LLMs and the latest in full-stack technologies.
								</li>
							</UnorderedList>
						</Text>
						<Text>＊&nbsp;&nbsp;＊&nbsp;&nbsp;＊</Text>
						<Text>
							I can adapt to most common web stacks, but I enjoy working with:{' '}
							{[
								{name: 'Typescript', color: 'blue'},
								{name: 'Next.js', color: 'green'},
								{name: 'PostgreSQL', color: 'orange'},
								{name: 'Redis', color: 'red'},
								{name: 'Docker', color: 'blue'},
								{name: 'Python', color: 'orange'},
								{name: 'UNIX', color: 'purple'},
							].map(({name, color}, i, arr) => (
								<Fragment key={name}>
									<Text
										color={`${color}.300`}
										mr={i + 1 === arr.length ? 0 : 2}
										as={'span'}
										display={'inline-block'}
									>
										{name + (i + 2 >= arr.length ? '' : ', ')}
									</Text>
									{i + 2 === arr.length && (
										<Text as={'span'} mr={2}>
											&
										</Text>
									)}
								</Fragment>
							))}
						</Text>
						<Text w={'100%'} pt={4}>
							If you think we’d work well together, please get in touch!
						</Text>
					</VStack>
				</VStack>
				{/*<VStack mt={10} w={'full'}>*/}
				{/*	<Text>*/}
				{/*		I'm not available for commissions currently, but I've worked on a*/}
				{/*		few projects in the past, some of which are below:*/}
				{/*	</Text>*/}
				{/*	<Flex*/}
				{/*		w={'full'}*/}
				{/*		pt={10}*/}
				{/*		justifyContent={'center'}*/}
				{/*		direction={['column', 'column', 'row']}*/}
				{/*		pl={[0, '20%', '15%']}*/}
				{/*	>*/}
				{/*		<SiteImage*/}
				{/*			src={'/assets/ascend-agency.png'}*/}
				{/*			transform={[*/}
				{/*				'rotate(10deg) translate(20px, 0px)',*/}
				{/*				'rotate(10deg)',*/}
				{/*				'rotate(10deg)',*/}
				{/*			]}*/}
				{/*			name={'Ascend Agency'}*/}
				{/*			url={'https://ascendagency.com'}*/}
				{/*		/>*/}
				{/*		<SiteImage*/}
				{/*			src={'/assets/hpt.png'}*/}
				{/*			transform={[*/}
				{/*				'rotate(-10deg) translate(130px,20px)',*/}
				{/*				'rotate(-10deg) translate(120px,-10px)',*/}
				{/*				'rotate(-10deg) translate(-70px,20px)',*/}
				{/*			]}*/}
				{/*			name={'Hamilton Premium Tutoring'}*/}
				{/*			url={'https://hamiltonpremiumtutoring.com'}*/}
				{/*		/>*/}
				{/*		<SiteImage*/}
				{/*			src={'/assets/revisio.png'}*/}
				{/*			transform={[*/}
				{/*				'rotate(5deg) translate(20px,-20px)',*/}
				{/*				'rotate(5deg) translate(-30px,-50px)',*/}
				{/*				'rotate(5deg) translate(-110px,-10px)',*/}
				{/*			]}*/}
				{/*			name={'Revisio'}*/}
				{/*			url={'https://revisio.app/'}*/}
				{/*		/>*/}
				{/*	</Flex>*/}
				{/*</VStack>*/}
			</VStack>
		</Container>
	);
}

const SpotifyTag = () => {
	const lastFM = useLastFM('wyattsell', 'd573f0784116580179348a453766d1df');
	const {data} = usePalette(lastFM.song?.art || '', 4, 'hex', {
		crossOrigin: 'anonymous',
	});
	const [colors, setColors] = useState<string[]>([]);

	useEffect(() => {
		if (data) {
			setColors(data);
		}
	}, [data]);

	if (lastFM.status !== 'playing') return null;

	const {bg, color} = textColor(colors);

	return (
		<Tag bgColor={bg} color={color} mb={2}>
			Listening to&nbsp;
			<Link
				href={lastFM.song.url}
				maxW={[40, 40, 60]}
				textOverflow={'ellipsis'}
				whiteSpace={'nowrap'}
				overflow={'hidden'}
			>
				{lastFM.song.name} by {lastFM.song.artist}
			</Link>
		</Tag>
	);
};

function textColor(hex: string[]) {
	const luminanceMap = hex.map(h => tinycolor(h).getLuminance());
	const lightestColor =
		hex[luminanceMap.indexOf(Math.max.apply(null, luminanceMap))];
	return {
		bg: lightestColor,
		color: '#' + tinycolor(lightestColor).darken(50).toHex(),
	};
}

const SiteImage = (props: {
	transform: string | string[];
	src: string;
	name: string;
	url: string;
}) => {
	return (
		<AspectRatio
			as={Link}
			ratio={16 / 10}
			width={60}
			rounded={'lg'}
			overflow={'hidden'}
			transform={props.transform}
			shadow={'xl'}
			cursor={'pointer'}
			_hover={{
				zIndex: 10,
			}}
			title={props.name}
			href={props.url}
		>
			<NextImage src={props.src} layout={'fill'} />
		</AspectRatio>
	);
};

const waveKeyframes = keyframes`
    0% { transform: rotate( 0.0deg) }
    10% { transform: rotate(14.0deg) }  /* The following five values can be played with to make the waving more or less extreme */
    20% { transform: rotate(-8.0deg) }
    30% { transform: rotate(14.0deg) }
    40% { transform: rotate(-4.0deg) }
    50% { transform: rotate(10.0deg) }
    60% { transform: rotate( 0.0deg) }  
    100% { transform: rotate( 0.0deg) }
`;

const WavingEmoji = styled.span`
	animation-name: ${waveKeyframes}; /* Refers to the name of your @keyframes element below */
	animation-duration: 3.5s; /* Change to speed up or slow down */
	animation-iteration-count: infinite; /* Never stop waving :) */
	transform-origin: 70% 70%; /* Pivot around the bottom-left palm */
	display: inline-block;
	height: 1lh;
`;
