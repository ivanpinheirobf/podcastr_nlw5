import "../styles/global.scss";
import { PlayerProvider } from "../contexts/PlayerContext";
import Header from "../components/Header";
import Player from "../components/Player";

import styles from "../styles/app.module.scss";

export default function MyApp({ Component, pageProps }) {
  return (
    <PlayerProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerProvider>
  );
}