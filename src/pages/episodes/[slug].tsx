import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link'
import { api } from '../../services/api';
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

import styles from "./episode.module.scss"
import { useContext } from 'react';
import { PlayerContext } from '../../contexts/PlayerContext';
import Head from 'next/head';

interface Episode {
  id: string,
  title: string,
  thumbnail: string,
  members: string,
  publishedAt: string,
  duration: number,
  durationAsString: string,
  description: string,
  url: string,
}

interface EpisodeProps {
  episode: Episode,
  // episode: Array<Episode>, // outra opção
}

export default function Episode({ episode }: EpisodeProps) {
  const { isPlaying, play, togglePlay } = useContext(PlayerContext);

  return (
    <div className={styles.episode}>
      <Head>
        <title>{episode.title} | Podcastr</title>
      </Head>

      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />

        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.descriptions}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  )
}

// essa const getStaticPaths é necessária porque estamos usando uma página estática dinâmica, ou seja, ela possui [] no seu título do arquivo e isso a deixa dinâmica, podendo ter 1 ou várias páginas iguais a essa
export const getStaticPaths: GetStaticPaths = async () => {

  // aqui estou pegando os 2 ultimos episodios que foram publicados
  const { data } = await api.get('episodes', {
    params: {
      _limit: 2,
      _sort: "published_at",
      _order: "desc",
    }
  });

  // com eles, vou criar os objetos de paths, para gerar estaticamente quando dermos um build na aplicação
  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id,
      }
    }
  });

  return {
    // se passo o paths vazios, o build do next não gera nenhuma página estática. Se eu passar, dentro de params, o atributo de algum "episode", ele gera esse episode ou mais em 1 ou mais páginas estáticas
    // paths: [ { params: { slug: "a-importancia-da-contribuicao-em-open-source", } } ],
    paths,
    // fallback determina o que acontece se um usuário acessar um endereço que não tenha sido criado estaticamente com o paths.
    // se fallback: false e a página não tiver sido criada em paths, retorna error 404 (página não encontrada)
    // se fallback: true e a página não tiver sido criada, quando o usuário acessa a página, ele carrega essa página pelo "client"
    // se fallback: 'blocking' e a página não tiver sido criada, quando o usuário acessa a página, ele carrega essa página pelo "next"
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params;

  const { data } = await api.get(`episodes/${slug}`)

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  };

  return {
    props: {
      episode,
    },
    revalidate: 68 * 60 * 24, // a cada 24 horas faremos uma chamada à api
  }
}