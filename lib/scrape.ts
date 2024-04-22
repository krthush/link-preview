import { GoToOptions } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdblockerPlugin  from 'puppeteer-extra-plugin-adblocker';
import cheerio from 'cheerio';
import axios from 'axios';
import UserAgent from 'user-agents';

export interface SiteData {
  url: string
  title?: string
  favicon?: string
  description?: string
  image?: string
  author?: string
  siteName?: string
  largestImage?: string
}

export interface ScrapeOptions  {
  scrape?: boolean
  stealth?: boolean
  stealthOptions?: {
    gotoOptions?: GoToOptions
  }
}

export const scrapeSite = async (url: string, options?: ScrapeOptions) => {
  
  let html: any;
  let errors: Array<any> = [];
  let siteData: SiteData | undefined;

  // First try standard request using axios
  try {
    const res = await axios.get(url);
    html = res.data;
  } catch (err) {
    console.log(err);
    errors.push(err);
  }
  if (html) {
    siteData = scrapeMetaTags(url, html);
  }

  // Check if stealth scrapping allowed
  // Then if no site data OR site image found try stealth puppeteer with searching for largest image
  if (options?.stealth !== false && (siteData === undefined || siteData.image === undefined)) {
    try {
      const scrapedData = await stealthScrapeUrl(url, options);
      html = scrapedData.html;
      siteData = scrapeMetaTags(url, html);
      siteData.largestImage = scrapedData.largestImage;
    } catch (err) {
      console.log(err);
      errors.push(err);
    }
  }

  return {
    data: siteData,
    errors: errors
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

  const title = getMetatag('title') ? getMetatag('title') : $('title').first().text();

  return {
    url,
    title: title,
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
const stealthScrapeUrl = async (url: string, options?: ScrapeOptions) => {

  let html;
  let largestImage;

  await puppeteer.use(StealthPlugin()).use(AdblockerPlugin({ 
    blockTrackers: true 
  })).launch({
    args: ['--no-sandbox',"--single-process"] 
  }).then(async browser => {

    const page = await browser.newPage();

    // Set user agent for additional stealth, see https://github.com/berstend/puppeteer-extra/issues/155
    const userAgent = new UserAgent();
    await page.setUserAgent(userAgent.toString());

    await page.goto(url, options?.stealthOptions?.gotoOptions);
    html = await page.evaluate(() => document.querySelector('*')?.outerHTML);

    // Debugging
    // const fs = require("fs");
    // fs.writeFile("example.html", html);
    // await page.screenshot({ path: 'example.png' });

    // Check through images in site for largest image to use incase site image not found
    largestImage = await page.evaluate(() => {
      const imageLargest = () => {
        let best = null;
        let images = document.getElementsByTagName("img");
        for (let img of images as any) {
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