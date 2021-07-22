import React, {ReactNode} from 'react';
import {
	Button,
	ButtonsContainer,
	Carousel,
	FlexSpacer,
	Footer,
	Icon,
	IconsContainer,
	Name,
	NameAndCarousel,
	PrimaryContainer,
	SeeMyWorkButton,
} from '../components/Landing';
import {RiDiscordFill, RiGithubFill, RiMediumFill} from 'react-icons/ri';
const Home = () => (
	<>
		<FlexSpacer />
		<MainContent>Wyatt Sell</MainContent>
		<Footer />
	</>
);

export const MainContent = (props: {children: ReactNode}) => (
	<PrimaryContainer>
		<NameAndCarousel>
			<Name>{props.children}</Name>
			<Carousel phrases={['Web developer', 'Maker', 'Open source enthusiast', 'Programmer']} />
		</NameAndCarousel>
		<ButtonsContainer>
			<Button href="mailto:wyattsetonsell@gmail.com">Get In Touch</Button>
			<SeeMyWorkButton href={'/work'}>See my work</SeeMyWorkButton>
		</ButtonsContainer>
		<IconsContainer>
			<Icon icon={RiGithubFill} href={'https://github.com/wyatt'} name={'Github'} />
			<Icon icon={RiDiscordFill} href={'https://dsc.bio/wyatt'} name={'Discord'} />
			<Icon icon={RiMediumFill} href={'https://wyattsell.medium.com'} name={'Medium'} />
		</IconsContainer>
	</PrimaryContainer>
);

// noinspection JSUnusedGlobalSymbols
export default Home;
