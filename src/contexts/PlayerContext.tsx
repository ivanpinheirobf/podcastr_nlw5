import { createContext, ReactNode, useState } from 'react';

interface Episode {
  title: string,
  members: string,
  thumbnail: string,
  duration: number,
  url: string
}

interface PlayerContextData {
  episodeList: Array<Episode>,
  currentEpisodeIndex: number,
  isPlaying: boolean,
  isLooping: boolean,
  isShuffling: boolean,
  play: (episode: Episode) => void,
  playList: (list: Episode[], index: number) => void,
  togglePlay: () => void,
  toggleLoop: () => void,
  toggleShuffle: () => void,
  setPlayingState: (state: boolean) => void,
  playNext: () => void,
  playPrevious: () => void,
  clearPlayerState: () => void,
}

interface ChildrenProvider {
  children: ReactNode,
}

// essa é uma opção de criar o context
/* export const PlayerContext = createContext({
  episodeList: [],
  currentEpisodeIndex: 0,
}); */

// essa é a outra opção de criar o context, atribuindo a um objeto vazio uma interface predefinida
export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerProvider({ children }: ChildrenProvider) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(false);
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(false);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function playNext() {
    const nextEpisodeIndex = currentEpisodeIndex + 1;

    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (nextEpisodeIndex < episodeList.length) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  function playPrevious() {
    const previousEpisodeIndex = currentEpisodeIndex - 1;
    
    if (isShuffling) {
      const previousRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(previousRandomEpisodeIndex);
    } else if (previousEpisodeIndex >= 0) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  function clearPlayerState() {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  return (
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      isPlaying,
      isLooping,
      isShuffling,
      play,
      playList,
      togglePlay,
      toggleLoop,
      toggleShuffle,
      setPlayingState,
      playNext,
      playPrevious,
      clearPlayerState,
    }}>
      {children}
    </PlayerContext.Provider>
  );

}
