import React from 'react';
import tw, {styled} from 'twin.macro';
import AlphabetSoup from 'react-alphabet-soup';
import useMobileDetect from 'use-mobile-detect-hook';
import {RiArrowLeftLine} from 'react-icons/ri';
import Link from 'next/link';

const Work = () => {
	return (
		<>
			<ReturnHome />
			<Heading />
			<WorkGrid>
				<WorkItem
					href={'https://ascendagency.net'}
					img={'ascendagency.png'}
					name={'Ascend Agency'}
					text={'A complex, modern 4 page site for a branding agency'}
				/>
				<WorkItem
					href={'https://github.com/wyatt/tasktracker'}
					img={'tasktracker.png'}
					name={'Task Tracker'}
					text={'A flexible and simple platform to create progress bars'}
				/>

				<WorkItem
					href={'https://wyatt.github.io/seneca'}
					img={'senecalearning.png'}
					name={'Seneca Learning'}
					text={'An unofficial API for SenecaLearning'}
				/>
				<WorkItem
					href={'https://coneheadmc.live'}
					img={'conehead.png'}
					name={'Conehead'}
					text={'An attractive and functional website for a minecraft streamer'}
				/>
				<WorkItem
					href={'https://github.com/wyatt/edulink-sync'}
					img={'edulink-sync.png'}
					name={'Edulink Sync'}
					text={'A tool I developed for syncing between EduLink and Google Calendar'}
				/>
				{/*<h1*/}
				{/*	tw="col-span-full text-center text-3xl font-semibold text-white flex justify-center items-center"*/}
				{/*	css={{height: '20vh'}}*/}
				{/*	className={'animate__animated animate__delay-4s animate__fadeIn'}*/}
				{/*>*/}
				{/*	More Coming Soon!*/}
				{/*</h1>*/}
			</WorkGrid>
		</>
	);
};

const ReturnHome = () => (
	<Link href="/">
		<a tw="flex items-center text-white text-xl m-3 bg-black bg-opacity-20 p-2 w-min rounded-lg cursor-pointer transform hover:scale-110 transition">
			<RiArrowLeftLine /> Home
		</a>
	</Link>
);

const Heading = () => (
	<div tw="h-96 items-center justify-center flex w-full flex-col text-white p-6 text-center">
		<Header className="animate__animated animate__zoomInDown">Work</Header>
		<p tw="text-lg font-semibold opacity-80" className={'animate__animated animate__delay-2s animate__fadeIn'}>
			Below are some examples of what I can do!
		</p>
	</div>
);

const Header = tw.h1`font-bold text-white text-8xl lg:text-9xl`;

const WorkGrid = tw.div`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 h-full auto-rows-auto overflow-hidden`;

const WorkItem = (props: {href: string; img: string; text: string; name: string}) => {
	const detectMobile = useMobileDetect();
	return (
		<WorkItemContainer href={props.href} img={props.img} className={'group animate__animated animate__delay-3s animate__zoomIn'}>
			<div tw={'text-center flex flex-col items-center justify-center'}>
				<h1 tw="text-4xl md:text-5xl">{props.name}</h1>
				<p css={[tw`pt-2 pointer-events-none text-center opacity-80 w-72 text-base`]}>{props.text}</p>
			</div>
		</WorkItemContainer>
	);
};

interface WorkItemContainerTypes {
	img: string;
}

const WorkItemContainer = styled.a<WorkItemContainerTypes>`
	min-height: 300px;
	height: max(30vh, 15vw);
	position: relative;

	${tw`text-white flex items-center justify-center font-semibold flex flex-col overflow-hidden transition`}
	&:hover {
		h1,
		p {
			opacity: 0;
		}
		&::before {
			filter: brightness(75%);
		}
	}

	&::before {
		content: '';
		//noinspection CssUnknownTarget
		background: url('img/${props => props.img}') center / cover no-repeat;
		filter: brightness(2%);
		${tw`transition-all ease-in-out duration-300`}
		width: 100%;
		height: 100%;
		z-index: -2;
		position: absolute;
	}
`;

export default Work;
