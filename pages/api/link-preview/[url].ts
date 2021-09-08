// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { Method } from 'axios';
import cheerio from 'cheerio';
import psl from 'psl';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import api from '../../../lib/api';
import { extractHostname, isValidWebUrl } from '../../../utils';
import withLinkPreviewQuery, { LinkParamsRequest } from '../../../middleware/withLinkPreviewQuery';

interface ApiData {
  success: boolean
  result?: {
    siteData?: SiteData,
    imageSearch?: string,
    imageResults?: Array<string>,
    topImage?: string
  }
  error?: any
  errors?: Array<any>
}

interface SiteData {
  url: string
  title: string
  favicon?: string
  description?: string
  image?: string
  author?: string
  siteName?: string
  largestImage?: string
}

const handler = async (req: LinkParamsRequest, res: NextApiResponse<ApiData>) => {
  const { url, stealth, search } = req.params;
  console.log(url);
  console.log(stealth);
  console.log(search);
  const targetUrl = decodeURIComponent(Buffer.from(url, 'base64').toString());
  if (isValidWebUrl(targetUrl)) {
    switch (req.method) {
      case 'GET':

        // Get search images for domain name
        let domainNameImageUrls: Array<string> = [];
        let imageSearchString;
        let errors: Array<any> = [];
        const rootDomain = psl.get(extractHostname(targetUrl));
        if (rootDomain) {
          const parsed = psl.parse(rootDomain);
          if (!parsed.error) {
            if (parsed.sld) {
              imageSearchString = parsed.sld; // domain name
              const imageSearch = await getBingImageSearch(imageSearchString);
              if (imageSearch.results) {
                domainNameImageUrls = imageSearch.results.map((imageResult: { contentUrl: string; }) => imageResult.contentUrl)
              } else {
                errors.push(imageSearch.error);
              }
            } else {
              throw Error("Second level domain not found");
            }
          } else {
            throw Error(JSON.stringify(parsed.error));
          }
        } else {
          throw Error("Root domain not found");
        }
      
        // Scraped given url/link to get site data
        const scrapedSite = await scrapeSite(targetUrl);
      
        if (scrapedSite.data) {
          if (/\S/.test(scrapedSite.data.title)) {
            // Get search images specific to given url/link
            imageSearchString = getImageSearchString(scrapedSite.data.title, scrapedSite.data.url, scrapedSite.data.siteName);
            const imageSearch = await getBingImageSearch(imageSearchString);
            if (imageSearch.results) { 
              const imageUrls = imageSearch.results.map((imageResult: { contentUrl: string; }) => imageResult.contentUrl);
              // Add in some of the search images for domain name
              imageUrls.splice(2, 0, domainNameImageUrls[0]);
              imageUrls.splice(5, 0, domainNameImageUrls[1]);
              imageUrls.splice(10, 0, domainNameImageUrls[2]);
              imageUrls.splice(15, 0, domainNameImageUrls[3]);
              imageUrls.splice(20, 0, domainNameImageUrls[4]);
              return res.status(200).json({
                result: {
                  siteData: scrapedSite.data,
                  imageSearch: imageSearchString,
                  imageResults: imageUrls,
                  topImage: await getTopImage(imageUrls, scrapedSite.data)
                },
                success: true
              })
            } else {
              // Fallback to just show domain search images if they exist and any errors
              errors.push(imageSearch.error);
              return res.status(200).json({
                errors: errors,
                success: true,
                result: {
                  siteData: scrapedSite.data,
                  imageSearch: imageSearchString,
                  imageResults: domainNameImageUrls,
                  topImage: await getTopImage(domainNameImageUrls, scrapedSite.data)
                }
              });
            }
          } else {
            // Fallback to just show domain search images if they exist and any errors
            return res.status(200).json({
              errors: errors,
              success: true,
              result: {
                siteData: scrapedSite.data,
                imageSearch: imageSearchString,
                imageResults: domainNameImageUrls,
                topImage: await getTopImage(domainNameImageUrls, scrapedSite.data)
              }
            });
          }
        } else {
          // Fallback to just show domain search images if they exist and any errors
          errors.push(scrapedSite.errors);
          return res.status(200).json({
            errors: errors,
            success: true,
            result: {
              imageSearch: imageSearchString,
              imageResults: domainNameImageUrls,
              topImage: await getTopImage(domainNameImageUrls)
            }
          });
        }

      default:
        return res.status(404).json({ success: false, error: `Method ${req.method} not allowed` });
    }
  } else {
    return res.status(400).json({ success: false, error: 'Invalid url parameter.' });
  }
}

const getImageSearchString = (title: string, url: string, siteName?: string) => {
  
  const rootDomain = psl.get(extractHostname(url));
  let searchString = title;
  if (rootDomain) {
    const domainSearchMask = rootDomain;
    const domainRegEx = new RegExp(domainSearchMask, 'ig'); 
    const stripRootDomain = title.replace(domainRegEx, '');
    if (/\S/.test(stripRootDomain)) {
      searchString = stripRootDomain;
    }
  }

  // Can remove site name here for more specificity but generally leads to worse results
  // const siteNameSearchMask = siteName ? siteName : '';
  // const siteNameRegEx = new RegExp(siteNameSearchMask, 'ig');
  // const stripSiteName = searchString.replace(siteNameRegEx, '');
  // searchString = stripSiteName;

  const stripSpecialChars = searchString.replace(/[&\/\\#,+()$~%.'":*?<>{}|—]/g, ' ').trim();
  searchString = stripSpecialChars;

  return searchString;

}

const getBingImageSearch = async (search: string): Promise<{ results?: Array<any>, error?: any }> => {
  const subscriptionKey = process.env.AZURE_BING_SEARCH_KEY;
  const url = 'https://api.bing.microsoft.com/v7.0/images/search';
  if (search) {
    const config = {
      method : 'GET' as Method,
      url: url + '?q=' + encodeURIComponent(search) + '&aspect=Square',
      headers : {
      'Ocp-Apim-Subscription-Key' : subscriptionKey,
      }
    }
    try {
      const res = await api.request(config);
      return {
        results: res.data.value
      }
    } catch (error) {
      return {
        error: error
      }
    }
  } else {
    return {
      error: "No search string for image"
    }
  }
}

const scrapeSite = async (url: string) => {
  
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
    } else {
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
          errors: errors
        }
      }
    }
  } else {
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
        errors: errors
      }
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

  await puppeteer.use(StealthPlugin()).launch().then(async browser => {

    const page = await browser.newPage();;
    await page.goto(url, { waitUntil: 'networkidle0' });

    html = await page.evaluate(() => document.querySelector('*')?.outerHTML);

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

// Get the "best" image i.e. valid image from results
const getTopImage = async (imageResults: Array<string>, siteDate?: SiteData) => {
  if (siteDate) {
    if (siteDate.image) {
      if (await checkIfValidImageUrl(siteDate.image)) {
        return siteDate.image;
      }
    }
    if (siteDate.largestImage) {
      if (await checkIfValidImageUrl(siteDate.largestImage)) {
        return siteDate.largestImage;
      }
    }
  }
  for (const imageUrl of imageResults) {
    if (await checkIfValidImageUrl(imageUrl)) {
      return imageUrl;
    }
  }
}

const checkIfValidImageUrl = async (imageUrl: string) => {
  try {
    const response = await axios.get(imageUrl);
    if (response.status == 200 && ((response.headers['content-type'])?.match(/(image)+\//g))?.length != 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log (err);
    return false;
  }
}

const mergeImageUrls = (array1:Array<string>, array2:Array<string>) => {
  let imageUrls:Array<string> = [];
  const l = Math.min(array1.length, array2.length);    
  for (let i = 0; i < l; i++) {
    imageUrls.push(array1[i], array2[i]);
  }
  imageUrls.push(...array1.slice(l), ...array2.slice(l));
  return imageUrls;
}

export default withLinkPreviewQuery(handler);