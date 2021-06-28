import {AppProps} from 'next/app';
import 'tailwindcss/tailwind.css';
import {GlobalStyles} from '../components/GlobalStyles';
import {MainContainer} from '../components/Background';
import 'animate.css';
import useSWR, {SWRConfig} from 'swr';
import {fetcher} from '../helper/fetcher';
import React from 'react';
import '@fontsource/lexend/700.css';
import '@fontsource/lexend/600.css';
import '@fontsource/lexend/500.css';
import Head from 'next/head';

export default function App({Component, pageProps, router}: AppProps) {
	return (
		<SWRConfig value={{refreshInterval: 15000, fetcher}}>
			<GlobalStyles />
			<MainContainer>
				<Head>
					<title>Wyatt Sell</title>
				</Head>
				<Component {...pageProps} key={router.route} />
			</MainContainer>
		</SWRConfig>
	);
}
