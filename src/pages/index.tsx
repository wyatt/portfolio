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
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import Image from 'next/image';
import {useLastFM} from 'use-last-fm';
import {usePalette} from 'color-thief-react';
import {tinycolor} from '@ctrl/tinycolor';
import {useEffect, useState} from 'react';

export default function Home() {
	return (
		<Container pt={[8, 20]} pb={4} maxW={'container.md'} minH={'100vh'}>
			<VStack w={'full'} spacing={'none'}>
				<VStack alignItems={'flex-start'}>
					<Stack
						direction={['column', 'row']}
						justifyContent={'space-between'}
						w={'full'}
					>
						<VStack alignItems={'flex-start'}>
							<Heading mb={2}>
								Hey, I'm Wyatt <WavingEmoji>👋</WavingEmoji>
							</Heading>
							<Flex w={'full'} flexWrap={'wrap'} justifyContent={'flex-start'}>
								<Tag colorScheme={'blue'} mr={2} mb={2}>
									Frontend engineer @{' '}
									<Link href={'https://remnote.com'}>Remnote</Link>
								</Tag>
								<SpotifyTag />
							</Flex>
						</VStack>
						<Button
							colorScheme={'blue'}
							variant={'ghost'}
							as={Link}
							href={'mailto:hello@wyattsell.com'}
						>
							Get in touch
						</Button>
					</Stack>
					<VStack pb={4} pt={2} alignItems={'flex-start'}>
						<Link
							href={'https://github.com/wyatt'}
							textDecoration={'underline'}
						>
							<i>Obligatory Github link</i>
						</Link>
					</VStack>
					<Text>
						I'm a programmer and student who enjoys making cool stuff using
						technology. I'm a massive productivity nerd, and am currently
						working on an exam revision tool that will be released{' '}
						<Link href={'https://wowwiki-archive.fandom.com/wiki/Soon'}>
							soon<sup>tm</sup>
						</Link>
						. I also have{' '}
						<Link
							href={'https://wyattsell.medium.com'}
							textDecoration={'underline'}
						>
							a blog
						</Link>{' '}
						where I'm trying to document the learning and creation of my various
						side projects.
					</Text>
				</VStack>
				<VStack mt={10} w={'full'}>
					<Text>
						I'm not available for commissions currently, but I've worked on a
						few projects in the past, some of which are below:
					</Text>
					<Flex
						w={'full'}
						pt={10}
						justifyContent={'center'}
						direction={['column', 'column', 'row']}
						pl={[0, '20%', '15%']}
					>
						<SiteImage
							src={'/assets/ascend-agency.png'}
							transform={[
								'rotate(10deg) translate(20px, 0px)',
								'rotate(10deg)',
								'rotate(10deg)',
							]}
							name={'Ascend Agency'}
							url={'https://ascendagency.com'}
						/>
						<SiteImage
							src={'/assets/hpt.png'}
							transform={[
								'rotate(-10deg) translate(130px,20px)',
								'rotate(-10deg) translate(120px,-10px)',
								'rotate(-10deg) translate(-70px,20px)',
							]}
							name={'Hamilton Premium Tutoring'}
							url={'https://hamiltonpremiumtutoring.com'}
						/>
						<SiteImage
							src={'/assets/gameoflife.png'}
							transform={[
								'rotate(5deg) translate(20px,-20px)',
								'rotate(5deg) translate(-30px,-50px)',
								'rotate(5deg) translate(-110px,-10px)',
							]}
							name={'Game of Life'}
							url={'https://gameoflife-omega.vercel.app/'}
						/>
					</Flex>
				</VStack>
				<VStack
					w="full"
					alignItems={'flex-start'}
					p={2}
					bg={'gray.50'}
					rounded={'lg'}
					mt={[4, 4, 24]}
					spacing={0}
				>
					<Text>Technologies I ❤️:</Text>
					<Flex w={'full'} flexWrap={'wrap'} justifyContent={'flex-start'}>
						{[
							{name: 'Typescript', color: 'blue'},
							{name: 'Yarn', color: 'orange'},
							{name: 'Next.js', color: 'blackAlpha'},
							{name: 'Chakra UI', color: 'teal'},
							{name: 'Prisma', color: 'green'},
							{name: 'PostgreSQL', color: 'blue'},
							{name: 'Redis', color: 'red'},
							{name: 'Docker', color: 'blue'},
							{name: 'Linux', color: 'purple'},
							{name: 'Git', color: 'orange'},
						].map(({name, color}, i, arr) => (
							<Tag
								colorScheme={color}
								mr={i + 1 === arr.length ? 0 : 2}
								mt={2}
								key={name}
							>
								{name}
							</Tag>
						))}
					</Flex>
				</VStack>
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
			<Image src={props.src} layout={'fill'} />
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
	animation-duration: 2.5s; /* Change to speed up or slow down */
	animation-iteration-count: infinite; /* Never stop waving :) */
	transform-origin: 70% 70%; /* Pivot around the bottom-left palm */
	display: inline-block;
`;
