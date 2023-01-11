import React from "react";
import styles from '../styles/Home.module.css'

const JokePage: React.FC<any> = ({ joke }) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <pre data-cy="joke">{joke}</pre>
      </main>
    </div>
  );
};

export default JokePage;

export const getServerSideProps = async () => {
  console.log('getServerSideProps')

  const url = 'https://v2.jokeapi.dev/joke/Any?type=single';
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json'
    }
  });
  const data = await res.json();
  console.log(data);

  return {
    props: {
      joke: data.joke
    },
  }
}