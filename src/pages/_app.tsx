import React from 'react';
import {ChakraProvider, extendTheme} from '@chakra-ui/react';
import {AppProps} from 'next/app';
import {SWRConfig} from 'swr';
import Head from 'next/head';
import '@fontsource/prata';
import '../global.css';

const theme = extendTheme({
	fonts: {
		heading: `'Prata', sans-serif`,
		body: `'Prata', serif;`,
	},
});

export default function App({Component, pageProps}: AppProps) {
	return (
		<SWRConfig
			value={{
				refreshInterval: 15000,
				fetcher: url => fetch(url).then(res => res.json()),
			}}
		>
			<ChakraProvider theme={theme}>
				<Head>
					<title>Wyatt Sell</title>
					<meta
						name="viewport"
						content="initial-scale=1.0, width=device-width"
					/>
					<meta
						name="description"
						content="I'm a programmer and student who enjoys making cool stuff using technology."
					/>
				</Head>
				<Component {...pageProps} />
			</ChakraProvider>
		</SWRConfig>
	);
}
