import { AppProps } from "next/app";
import "tailwindcss/tailwind.css";
import { GlobalStyles } from "../components/GlobalStyles";
import { MainContainer } from "../components/Background";
import "animate.css";
import useSWR, { SWRConfig } from "swr";
import { fetcher } from "../helper/fetcher";
import React from "react";

export default function App({ Component, pageProps, router }: AppProps) {
  const { data, error } = useSWR("/spotify", fetcher);
  if (error) return <div>failed to load</div>;
  return (
    <SWRConfig
      value={{
        refreshInterval: 15000,
      }}
    >
      <GlobalStyles />

      <MainContainer
        colors={
          data?.message?.gradient || [
            { color: "#348F50", position: 0 },
            { color: "#56B4D3", position: 50 },
          ]
        }
      >
        <Component {...pageProps} key={router.route} />
      </MainContainer>
    </SWRConfig>
  );
}
