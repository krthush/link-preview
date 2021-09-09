// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import psl from 'psl';

import { extractHostname, isString, isValidWebUrl } from '../../utils';
import { getBingImageSearch, getImageSearchString } from '../../lib/search';
import { scrapeSite, SiteData } from '../../lib/scraper';

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

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiData>) => {
  const params = getLinkPreviewParams(req);
  if (params.errors.length == 0) {
    const { url, stealth, search, validate } = params.data;
    const targetUrl = decodeURIComponent(Buffer.from(url, 'base64').toString());
    if (isValidWebUrl(targetUrl)) {
      switch (req.method) {
        case 'GET':
          const linkPreviewData = await getLinkPreviewData(targetUrl, stealth, search, validate);
          return res.status(200).json(linkPreviewData);
        default:
          return res.status(404).json({ success: false, error: `Method ${req.method} not allowed` });
      }
    } else {
      return res.status(400).json({ success: false, error: 'Url string is invalid.' });
    }
  } else {
    return res.status(400).json({ success: false, errors: params.errors });    
  }
}

// Get relevant params with validated & correct types
const getLinkPreviewParams = (req: NextApiRequest) => {
  const { url, stealth, search, validate } = req.query;
  let urlString = "";
  let stealthBool: boolean | undefined;
  let searchBool: boolean | undefined;
  let validateBool: boolean | undefined;
  let errors: Array<string> = [];
  if (url && isString(url)) {
    urlString = url
  } else {
    errors.push('Url base64 encoded string required. Only non array string parameter allowed.');
  }
  if (stealth) {
    if (stealth === 'true') {
      stealthBool = true;
    } else if (stealth === 'false') {
      stealthBool = false;
    } else {
      errors.push('Stealth parameter must be boolean - true or false.');
    }
  }
  if (search) {
    if (search === 'true') {
      searchBool = true;
    } else if (search === 'false') {
      searchBool = false;
    } else {
      errors.push('Search parameter must be boolean - true or false.');
    }
  }
  if (validate) {
    if (validate === 'true') {
      validateBool = true;
    } else if (validate === 'false') {
      validateBool = false;
    } else {
      errors.push('Validate parameter must be boolean - true or false.');
    }
  }
  return {
    data: {
      url: urlString,
      stealth: stealthBool,
      search: searchBool,
      validate: validateBool
    },
    errors: errors
  }
}

// Get preview data from site will fallbacks - site scraping (standard + stealth) and bing search for images
const getLinkPreviewData = async (targetUrl: string, stealth?: boolean, search?: boolean, validate?: boolean) => {

  // Get search images for domain name
  let domainNameImageUrls: Array<string> = [];
  let imageSearchString;
  let errors: Array<any> = [];
  if (search !== false) {
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
  }

  // Scraped given url/link to get site data
  const scrapedSite = await scrapeSite(targetUrl, stealth);
  errors.push(scrapedSite.errors);

  if (scrapedSite.data && scrapedSite.data.title) {
    if (/\S/.test(scrapedSite.data.title) && search !== false) {
      // Get search images specific to given url/link
      imageSearchString = getImageSearchString(scrapedSite.data.title, scrapedSite.data.url, scrapedSite.data.siteName);
      const imageSearch = await getBingImageSearch(imageSearchString);
      if (imageSearch.results) { 
        let imageUrls = imageSearch.results.map((imageResult: { contentUrl: string; }) => imageResult.contentUrl);
        // Add in some of the search images for domain name
        imageUrls = mergeImageUrls(imageUrls, domainNameImageUrls);
        return {
          errors: errors,
          success: true,
          result: {
            siteData: scrapedSite.data,
            imageSearch: imageSearchString,
            imageResults: imageUrls,
            topImage: ((validate !== false) ? await getTopImage(imageUrls, scrapedSite.data) : undefined)
          },
        }
      } else {
        // Fallback to just show domain search images if they exist and any errors
        errors.push(imageSearch.error);
        return {
          errors: errors,
          success: true,
          result: {
            siteData: scrapedSite.data,
            imageSearch: imageSearchString,
            imageResults: domainNameImageUrls,
            topImage: ((validate !== false) ? await getTopImage(domainNameImageUrls, scrapedSite.data) : undefined)
          }
        }
      }
    } else {
      // Fallback to just show domain search images if they exist and any errors
      return {
        errors: errors,
        success: true,
        result: {
          siteData: scrapedSite.data,
          imageSearch: imageSearchString,
          imageResults: domainNameImageUrls,
          topImage: ((validate !== false) ? await getTopImage(domainNameImageUrls, scrapedSite.data) : undefined)
        }
      }
    }
  } else {
    // Fallback to just show domain search images if they exist and any errors
    return {
      errors: errors,
      success: true,
      result: {
        imageSearch: imageSearchString,
        imageResults: domainNameImageUrls,
        topImage: ((validate !== false) ? await getTopImage(domainNameImageUrls) : undefined)
      }
    }
  }  

}

// Get the "best" image i.e. valid image from results
const getTopImage = async (imageResults: Array<string>, siteDate?: SiteData) => {
  if (siteDate) {
    // First check if there is site image from meta tags
    if (siteDate.image) {
      if (await checkIfValidImageUrl(siteDate.image)) {
        return siteDate.image;
      }
    }
    // Then check largest image from site
    if (siteDate.largestImage) {
      if (await checkIfValidImageUrl(siteDate.largestImage)) {
        return siteDate.largestImage;
      }
    }
  }
  // Iterate through bing search results for at least some image
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
  // let imageUrls:Array<string> = [];
  // const l = Math.min(array1.length, array2.length);    
  // for (let i = 0; i < l; i++) {
  //   imageUrls.push(array1[i], array2[i]);
  // }
  // imageUrls.push(...array1.slice(l), ...array2.slice(l));
  array1.splice(2, 0, array2[0]);
  array1.splice(5, 0, array2[1]);
  array1.splice(10, 0, array2[2]);
  array1.splice(15, 0, array2[3]);
  array1.splice(20, 0, array2[4]);
  return array1;
}

export default handler;