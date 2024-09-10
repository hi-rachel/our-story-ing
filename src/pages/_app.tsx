import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import "../i18n";
import { useEffect, useState } from "react";
import { auth } from "../../firebase";

const App = ({ Component, pageProps: { ...pageProps } }: AppProps) => {
  const [loading, setLoading] = useState(true);

  const init = async () => {
    const state = await auth.authStateReady();
    console.log("state", state);
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return <Component {...pageProps} />;
};

export default appWithTranslation(App);
