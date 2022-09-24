import "../styles/globals.css";
import { loadTheme } from "../helpers";
import { useRouter } from "next/router";
import { useEffect } from "react";
import "react-calendar/dist/Calendar.css";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const getLayout = Component.getLayout || ((page) => page);

  const init = async () => {
    loadTheme();
  };

  useEffect(() => {
    init();
  }, []);

  return getLayout(<Component {...pageProps} />);
}

export default MyApp;
