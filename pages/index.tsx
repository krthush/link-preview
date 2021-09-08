import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container} style={{marginLeft:"10px",marginRight:"10px"}}>
      <Head>
        <title>Link Preview</title>
        <meta name="description" content="A simple API site for getting link preview data." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="/">Link Preview!</a>
        </h1>
        <p className={styles.description}>
          A simple API site for getting link preview data <br />
        </p>
        <p style={{textAlign:"center"}}>
          Works with multiple fallbacks, such as stealth emulation of a browser + fetching images by search. <br />
          API built on Nextjs, but can be easily used in any Node.js enviroment.
        </p>
        <p className={styles.description}>
          GET request to <code className={styles.code}>/api/link-preview/[url]</code> <br />
        </p>
        <p style={{textAlign:"center"}}>
          Requires "url" parameter to be base64 encoded url to fetch link preview
        </p>
      </main>

      <footer className={styles.footer} style={{paddingTop:"10px",paddingBottom:"10px"}}>
        <a
          href="https://favorited.me"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made by{' '}
          <span className={styles.logo} style={{paddingRight: "5px", height:28}}>
            <Image src="/logo.svg" alt="Favorited Logo" width={30} height={30}/>
          </span>
          <span style={{color:"#fcb150", fontSize:"1.25rem"}}>Favorited</span>
        </a>
      </footer>
    </div>
  )
}
