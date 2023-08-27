import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthUserProvider } from "../../firebase/auth";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Personal Task Manager</title>
      </Head>
      <AuthUserProvider>
        <Component {...pageProps} />
      </AuthUserProvider>
    </>
  );
}
