import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import cheerio from 'cheerio';

import api from "./api";

export interface SiteData {
  url: string
  title: string
  favicon?: string
  description?: string
  image?: string
  author?: string
  siteName?: string
  largestImage?: string
}

export const scrapeSite = async (url: string, stealth?: boolean) => {
  
  let html: any;
  let errors: Array<any> = [];
  let tagData: SiteData | undefined;

  try {
    const res = await api(encodeURI(decodeURI(url))); // Recode URI to avoid Error Request path contains unescaped characters
    html = res.data;
  } catch (err: any) {
    if (err.response) {
      // Request made and server responded
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
    } else if (err.request) {
      // The request was made but no response was received
      console.log(err.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', err.message);
    }
    errors.push(err);
  }

  if (html) {
    tagData = scrapeMetaTags(url, html);
    // If no image found try stealth puppeteer with searching for largest image
    if (tagData.image) {
      return {
        data: tagData
      }
    } else if (stealth !== false) {
      try {
        const scrapedData = await stealthScrapeUrl(url);
        tagData.largestImage = scrapedData.largestImage;
        return {
          data: tagData
        }
      } catch (err) {
        console.log(err);
        errors.push(err);
        return {
          data: tagData,
          errors: errors
        }
      }
    } else {
      return {
        data: tagData
      }
    }
  } else if (stealth !== false) {
    try {
      const scrapedData = await stealthScrapeUrl(url);
      html = scrapedData.html;
      tagData = scrapeMetaTags(url, html);
      tagData.largestImage = scrapedData.largestImage;
      return {
        data: tagData
      }
    } catch (err) {
      console.log(err);
      errors.push(err);
      return {
        data: tagData,
        errors: errors
      }
    }
  } else {
    return {
      data: tagData
    }
  }

}

// Use cheerio (jQuery like selector for html) to fetch site meta tags
const scrapeMetaTags = (url: string, html: any) => {

  const $ = cheerio.load(html);
  
  const getMetatag = (name: string) =>  
      $(`meta[name=${name}]`).attr('content') ||  
      $(`meta[name="og:${name}"]`).attr('content') || 
      $(`meta[property="og:${name}"]`).attr('content') ||  
      $(`meta[name="twitter:${name}"]`).attr('content');

  return {
    url,
    title: $('title').first().text(),
    favicon: $('link[rel="shortcut icon"]').attr('href'),
    // description: $('meta[name=description]').attr('content'),
    description: getMetatag('description'),
    image: getMetatag('image'),
    author: getMetatag('author'),
    siteName: getMetatag('site_name')
  }

}

// Additional fallback using stealth puppeteer see "https://github.com/berstend/puppeteer-extra/wiki/Beginner:-I'm-new-to-scraping-and-being-blocked"
// For sites such as https://www.fiverr.com/sorich1/fix-bugs-and-build-any-laravel-php-and-vuejs-projects, https://www.netflix.com/gb/title/70136120
const stealthScrapeUrl = async (url: string) => {

  let html;
  let largestImage;

  const chromeOptions = {
    headless: true,
    defaultViewport: null,
    args: [
        "--incognito",
        "--no-sandbox",
        "--single-process",
        "--no-zygote"
    ],
  };

  await puppeteer.use(StealthPlugin()).launch(chromeOptions).then(async browser => {

    const page = await browser.newPage();
    await page.goto(url);

    html = await page.evaluate(() => document.querySelector('*')?.outerHTML);

    // Check through images in site for largest image to use incase site image not found
    largestImage = await page.evaluate(() => {

      const imageLargest = () => {
        let best = null;
        let images = document.getElementsByTagName("img");
        for (let img of images as any) {
          console.log(img.src);
          if (imageSize(img) > imageSize(best)) {
            best = img
          }
        }
        return best;
      }

      const imageSize = (img: HTMLImageElement) => {
        if (!img) {
          return 0;
        }
        return img.naturalWidth * img.naturalHeight;
      }

      const imageSrc = (img: HTMLImageElement) => {
        if (!img) {
          return null;
        }
        return img.src
      }

      return imageSrc(imageLargest()); 

    });

    await browser.close();

  });

  return {
    html: html,
    largestImage: largestImage
  };

}