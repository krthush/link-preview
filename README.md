## Link Preview

An API for getting near perfect link preview data.

Works with multiple fallbacks, such as stealth emulation of a browser + fetching images by search.

API built on [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). Can be easily used in any other Node.js enviroments (NOT serverless - see [serverless issues](#serverless-issues)).

## [Demo - Try it out!](https://favorited-link-preview.herokuapp.com/)

## Usage

For link previews, make GET requests to `/api/link-preview?url=`

Requires "url" parameter to be base64 encoded string to fetch link preview.

Optional boolean parameters "stealth", "search", "validate" can be used:

1. "stealth" - includes stealth browser emulation (longer fetch but very accurate results)
2. "search" - includes bing search images (longer fetch but multiple images)
3. "validate" - includes "top" image that is validated (longer fetch but ensures image src exists and loads)

For Bing Search to work you will need the following enviroment variable: `AZURE_BING_SEARCH_KEY`, see [Bing Image Search API](https://www.microsoft.com/en-us/bing/apis/bing-image-search-api).

## Example Link Preview

Link preview for [https://www.youtube.com/](https://www.youtube.com/)

Base64 encoded url: aHR0cHM6Ly93d3cueW91dHViZS5jb20v

Preview route: [http://localhost:3000/api/link-preview?url=aHR0cHM6Ly93d3cueW91dHViZS5jb20v](http://localhost:3000/api/link-preview?url=aHR0cHM6Ly93d3cueW91dHViZS5jb20v)

Result:

```
{
  "errors": [
    null
  ],
  "success": true,
  "result": {
    "siteData": {
      "url": "https://www.youtube.com/",
      "title": "YouTube",
      "favicon": "https://www.youtube.com/s/desktop/6b6f031c/img/favicon.ico",
      "description": "Enjoy the videos and music that you love, upload original content and share it all with friends, family and the world on YouTube.",
      "image": "https://www.youtube.com/img/desktop/yt_1200.png"
    },
    "imageSearch": "YouTube",
    "imageResults": [
      "https://i.pinimg.com/736x/b6/3f/a4/b63fa416051653ae9cc944b67e559355--youtube-logo-social-media-marketing.jpg",
      "https://freepngimg.com/download/youtube/24980-9-youtube-transparent-background.png",
      "https://i.pinimg.com/736x/b6/3f/a4/b63fa416051653ae9cc944b67e559355--youtube-logo-social-media-marketing.jpg",
      "http://cdn.osxdaily.com/wp-content/uploads/2018/08/play-youtube-video-background-iphone.jpg",
      "https://trcmedia.org/media/1508/youtube-originals.jpg",
      "https://freepngimg.com/download/youtube/24980-9-youtube-transparent-background.png",
      "https://clipground.com/images/youtube-music-logo-png-2.png",
      "http://cdn2.computeridee.nl/articles/Youtube.png",
      "https://www.buysocialbuzz.com/wp-content/uploads/2018/10/youtube-logo.png",
      "https://img1.cgtrader.com/items/1026261/696391c77b/youtube-logo-3d-model-low-poly-max-obj-mtl-3ds-fbx-c4d-ma-mb.jpg",
      "http://cdn.osxdaily.com/wp-content/uploads/2018/08/play-youtube-video-background-iphone.jpg",
      "https://yt3.ggpht.com/a-/AAuE7mBc4ZIdvvJdkoMJnVhED2Uzxllm3dtpgd0GEw=s900-mo-c-c0xffffffff-rj-k-no",
      "https://cliply.co/wp-content/uploads/2019/04/371903520_SOCIAL_ICONS_YOUTUBE.png",
      "http://www.h3xed.com/blogmedia/youtube-thumb.png",
      "https://www.thegadgethelper.com/wp-content/uploads/2020/04/youtube-com-activate.png",
      "https://trcmedia.org/media/1508/youtube-originals.jpg",
      "https://www.magneticmag.com/.image/t_share/MTM0NDIyOTg3MTcxNDgxNjEw/youtube_music_service_concept_logojpg.jpg",
      "https://www.freeiconspng.com/uploads/image-youtube-icon-9.png",
      "https://www.iconpacks.net/icons/2/free-youtube-logo-icon-2431-thumb.png",
      "https://yt3.ggpht.com/a/AATXAJwRo5CFo9_WXrjTw19ddoEKN-4XZCJn0jkaBg=s900-c-k-c0xffffffff-no-rj-mo",
      "https://clipground.com/images/youtube-music-logo-png-2.png",
      "http://www.newdesignfile.com/postpic/2010/04/youtube-logo-transparent_306220.png",
      "https://cdn.wccftech.com/wp-content/uploads/2015/10/YouTube_Play.png",
      "https://cloudfront.bernews.com/wp-content/uploads/2016/01/youtube-icon-generic-322141-2.png",
      "https://images.techhive.com/images/article/2017/03/youtube-music-videos-100716013-orig.jpeg",
      "https://clipartart.com/images/youtube-subscribe-button-clipart-download-1.jpg",
      "https://vectorified.com/images/official-youtube-icon-3.jpg",
      "https://www.clker.com/cliparts/9/f/d/9/13672177341152140441free-gold-button-youtube-hi.png",
      "https://www.freeiconspng.com/uploads/youtube-icon-21.png",
      "https://images.template.net/wp-content/uploads/2016/04/28063332/Sample-Youtube-Icon-Download.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/80/YouTube_Spotlight_logo.png",
      "https://cdn.macrumors.com/article-new/2015/11/youtubemusic-800x707.jpg?retina",
      "https://clipartart.com/images/clipart-youtube-icon-7.jpg",
      "https://cdn.wccftech.com/wp-content/uploads/2015/10/YouTube.png",
      "https://bloximages.chicago2.vip.townnews.com/heraldextra.com/content/tncms/assets/v3/editorial/5/8f/58f38b9c-d7a6-5e17-8a01-d33ff1c4ac6c/5665ff6c7f058.image.jpg?resize=1200%2C1200",
      "https://clipground.com/images/youtube-logo-black-and-white-2.jpg",
      "https://clipground.com/images/youtube-icon-png-free-download-3.png",
      "http://cdn.onlinewebfonts.com/svg/img_45240.png",
      "https://yt3.ggpht.com/a/AATXAJxFxv7GkT4x65uBGNa6Dz9YCdCsTD6L8ppv8Q=s900-c-k-c0xffffffff-no-rj-mo",
      "https://clipground.com/images/youtube-clipart-file-13.jpg"
    ],
    "topImage": "https://www.youtube.com/img/desktop/yt_1200.png"
  }
}
```

## Next.js - Getting Started

Download/Fork project then install packages: 

```bash
npm install
# or
yarn install
```

Then run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the landing page. 

Link preview route should work on [http://localhost:3000/api/link-preview?url=...](http://localhost:3000/api/link-preview?url=...)

## Heroku - Deploy to production in 5 minutes

[Deploy the Next.js app to production in 5 minutes](https://mariestarck.com/deploy-your-next-js-app-to-heroku-in-5-minutes/) - this great article gives a very quick way to get this API up and running in production using Heroku. I highly recommend doing this, if you plan on using this in production, since the public routes for the demo shouldn't be relied upon for production!

Using Heroku, requires a few additional steps to make sure Puppeteer is working - see [Running Puppeteer on Heroku](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-on-heroku). In essence you need to ensure `puppeteer.launch({ args: ['--no-sandbox'] });` is used and Heroku's Linux box requires additional dependencies to be installed which can be done by the command `heroku buildpacks:add jontewks/puppeteer`.

## Issues with Serverless {#serverless-issues}

This API will be difficult to get working with serverless enviroments, especially AWS lambdas - this is primarily due to Puppeteer which is quite a large package (definitly hitting the AWS lambda limit of 50MB). Unfortunatly without Puppeteer the results of the link previews get severely degraded. See [Running Puppeteer on AWS Lambda](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-on-aws-lambda) for further info.

## Contributing

This API was built for use with the [Favorited](https://favorited.me/) platform and is actively maintain by the Favorited team. We'd love any help with the project - feel free to open any issues, contribute with PRs, and whatever you'd feel like doing! We're keen on getting the link preview working as close to perfect as can be.

The idea to open source this was inspired after seeing popular social media apps (signal, whatsapp, facebook etc.) having very good link preview services, and in contrary the freely available APIs / link preview systems online being quite lack lustre. The fetching of link previews is hard to perfect since many sites put methods in place to prevent easy data fetching/scraping - see [puppeteer-extra to prevent detection](https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth#status). Therefore its hard to guarantee link previews for all the URLs that exist, so if you do find any "problem sites" that don't generate great links - please open an issue, so we can get it working!