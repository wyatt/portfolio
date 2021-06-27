import tw, {css, styled, theme} from 'twin.macro';
import {GradientColors} from '../types/types';
import React, {ReactNode} from 'react';
import useSWR from 'swr';

export const MainContainer = (props: {children: ReactNode}) => {
	const {data} = useSWR('/spotify');

	const colors = data?.message?.gradient || [
		{color: '#348F50', position: 0},
		{color: '#56B4D3', position: 50},
	];

	return (
		<BackgroundBase colors={colors}>
			<Content>{props.children}</Content>
		</BackgroundBase>
	);
};

const BackgroundBase = styled.div<GradientColors>`
	background: linear-gradient(-45deg ${props => props.colors.map(c => `,${c.color} ${c.position}%`)});
	${tw`w-full h-full flex min-h-screen`}
`;

const Content = styled.div`
	min-height: 100vh;
	z-index: 2;
	width: 100%;
	height: 100%;
	-webkit-backdrop-filter: blur(300px);
	backdrop-filter: blur(300px);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;
