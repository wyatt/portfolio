import { AppProps } from "next/app";
import "tailwindcss/tailwind.css";
import { GlobalStyles } from "../components/GlobalStyles";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <GlobalStyles />
      <Component {...pageProps} />
    </div>
  );
}
