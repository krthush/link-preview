import Head from 'next/head';
import Image from 'next/image';

import LinkPreview from '../components/LinkPreview';

const responseFormat = `{
  success: boolean
  result?: {
    siteData?: {
      url: string
      title: string
      favicon?: string
      description?: string
      image?: string
      author?: string
      siteName?: string
      largestImage?: string
    },
    imageSearch?: string,
    imageResults?: Array<string>,
    topImage?: string
  }
  error?: any
  errors?: Array<any>
}`;

export default function Home() {
  return (
    <div style={{marginLeft:"10px",marginRight:"10px"}}>
      <Head>
        <title>Link Preview</title>
        <meta name="description" content="A simple API site for getting link preview data." />
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />        
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css"/>
      </Head>

      <style jsx>{`
        .main {
          padding: 3rem 0;
        }
        .footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-grow: 1;
        }
      `}</style>

      <main className="main">
        <h1>Welcome to <a href="https://github.com/krthush/link-preview">Link Preview!</a></h1>
        <h2>A simple open source API for getting link preview data</h2>
        <p>
          <b><u>Near perfect</u></b> results with multiple fallbacks: stealth emulation of a browser &amp; fetching images by search. <br/><br/>
          API built on Nextjs, but can be easily used in any Node.js enviroment (NOT serverless).
        </p>
        <h2>Try it out!</h2>
        <LinkPreview/>
        <h2><a href="https://github.com/krthush/link-preview">Source code - Github</a></h2>
        <h2>GET request to <code>/api/link-preview?url=</code></h2>
        <p>
          Requires "url" parameter to be <b><u>base64 encoded</u></b> url to fetch link preview. <br/><br/>
          Optional boolean parameters "stealth", "search", "validate" can be used:
        </p>
        <ul style={{paddingInlineStart:20}}>
          <li>"stealth" - includes stealth browser emulation (longer fetch but very accurate results)</li>
          <li>"search" - includes bing search images (longer fetch but multiple images)</li>
          <li>"validate" - includes "top" image that is validated (longer fetch but ensures image src exists and loads)</li>
        </ul>
        <h2>Response format</h2>
        <p>
          <code style={{whiteSpace:"pre", display:"block"}}>{responseFormat}</code>
        </p>
      </main>

      <footer className="footer">
        <a
          href="https://favorited.me"
          target="_blank"
          rel="noopener noreferrer"
          style={{color:"#fcb150"}}
        >
          Made by {' '}
          <span style={{marginLeft: "5px", marginRight: "5px", height:24}}>
            <Image src="/icon.svg" alt="Favorited Logo" width={24} height={24}/>
          </span>
          <span style={{color:"#fcb150", fontSize:"1.2rem"}}><b>Favorited</b></span>
        </a>
      </footer>
      
    </div>
  )
}
