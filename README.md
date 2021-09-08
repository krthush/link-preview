## Link Preview

A simple API site for getting link preview data.

Works with multiple fallbacks, such as stealth emulation of a browser + fetching images by search. <br>API built on Nextjs, but can be easily used in any Node.js enviroment.

GET request to /api/link-preview/[url] <br>Requires "url" parameter to be base64 encoded url to fetch link preview

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed in the `pages/api` directory which is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Example Link Preview

Link preview for [https://www.youtube.com/](https://www.youtube.com/)

Base64 encoded url aHR0cHM6Ly93d3cueW91dHViZS5jb20v

Preview route at [http://localhost:3000/api/link-preview/aHR0cHM6Ly93d3cueW91dHViZS5jb20v](http://localhost:3000/api/link-preview/aHR0cHM6Ly93d3cueW91dHViZS5jb20v)

Result:

```
{
"result": {
"metaTags": {
"url": "https://www.youtube.com/",
"title": "YouTube",
"favicon": "https://www.youtube.com/s/desktop/2498be25/img/favicon.ico",
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
]
},
"success": true
}
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
