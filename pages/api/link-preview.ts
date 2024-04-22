// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import psl from 'psl';

import withAllowCORS from '../../middleware/withAllowCORS';

import { extractHostname, isString, isValidWebUrl, stringToBoolParam } from '../../utils';
import { getBingImageSearch, getImageSearchString } from '../../lib/search';
import { scrapeSite, SiteData, ScrapeOptions } from '../../lib/scrape';

import { getExceptionSiteData, ExtraData } from '../../utils/exceptions';

interface ApiData {
  success: boolean
  result?: {
    siteData?: SiteData
    imageSearch?: string
    imageResults?: Array<string>
    topImage?: string
    extraData?: ExtraData
  }
  error?: any
  errors?: Array<any>
}

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiData>) => {
  const params = getLinkPreviewParams(req);
  if (params.errors.length == 0) {
    const { url, stealth, search, validate } = params.data;
    switch (req.method) {
      case 'GET':
        try {
          const linkPreviewData = await getLinkPreviewData(url, stealth, search, validate);
          return res.status(200).json(linkPreviewData);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ success: false, error: error });
        }
      default:
        return res.status(404).json({ success: false, error: `Method ${req.method} not allowed` });
    }
  } else {
    return res.status(400).json({ success: false, errors: params.errors });    
  }
}

// Get relevant request params (validated) with correct types
// Ideally move this into Next.js middleware, but included here for easier use in other Node.js projects
const getLinkPreviewParams = (req: NextApiRequest) => {
  const { url, stealth, search, validate } = req.query;
  let urlString = "";
  let stealthBool: boolean | undefined;
  let searchBool: boolean | undefined;
  let validateBool: boolean | undefined;
  let errors: Array<string> = [];
  if (url && isString(url)) {
    const decodedUrl = decodeURIComponent(url).toString();
    if (isValidWebUrl(decodedUrl)) {
      urlString = decodedUrl
    } else {
      errors.push('Url is invalid.');
    }
  } else {
    errors.push('Url string required. Only non array string parameter allowed.');
  }
  if (stealth) try { stealthBool = stringToBoolParam(stealth) } catch (err) { errors.push(`Stealth ${err}`) };
  if (search) try { searchBool = stringToBoolParam(search) } catch (err) { errors.push(`Search ${err}`) };
  if (validate) try { validateBool = stringToBoolParam(validate) } catch (err) { errors.push(`Validate ${err}`) };
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
const getLinkPreviewData = async (url: string, stealth?: boolean, search?: boolean, validate?: boolean) => {

  // Default vars for api data result and errors
  let siteData: SiteData | undefined = undefined;
  let imageResults: Array<string> = [];
  let imageSearchString: string | undefined = undefined;
  let topImage: string | undefined = undefined;
  let extraData: ExtraData | undefined = undefined;
  let errors: Array<any> = [];

  // Default scraping options
  let scrapeOptions: ScrapeOptions | undefined = {
    scrape: true,
    stealth: stealth
  };

  // Check exception sites - adjust scrape options and assign extra data if needed
  // Currently this API contains exceptions for sites such Amazon, Twitter, etc.  
  const exceptionData = await getExceptionSiteData(url, stealth);
  if (exceptionData.scrapeOptions) scrapeOptions = exceptionData.scrapeOptions;
  if (exceptionData.extraData) extraData = exceptionData.extraData;

  // Get search images for domain name
  let domainNameImageUrls: Array<string> = [];
  if (search !== false) {
    const rootDomain = psl.get(extractHostname(url));
    if (rootDomain) {
      const parsed = psl.parse(rootDomain);
      if (!parsed.error) {
        if (parsed.sld) {
          imageSearchString = parsed.sld; // domain name
          const imageSearch = await getBingImageSearch(imageSearchString);
          if (imageSearch.results) {
            domainNameImageUrls = imageSearch.results.map((imageResult: { contentUrl: string; }) => imageResult.contentUrl);
            // Fallback to just show domain name images if no other images found
            imageResults = domainNameImageUrls;
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

  if (scrapeOptions.scrape) {
    // Scrape given url/link to get site data
    const scrapedSite = await scrapeSite(url, scrapeOptions);
    errors.concat(scrapedSite.errors);
  
    // Check scraped data and search data to construct api data result
    if (scrapedSite.data && scrapedSite.data.title) {
      siteData = scrapedSite.data;
      if (validate !== false) topImage = await getTopImage(imageResults, scrapedSite.data);
      // Ensure title is not empty string before bing search
      if (search !== false && siteData.title && /\S/.test(siteData.title)) {
        // Get search images specific to given url/link
        imageSearchString = getImageSearchString(siteData.title, siteData.url, siteData.siteName);
        const imageSearch = await getBingImageSearch(imageSearchString);
        if (imageSearch.results) { 
          const imageUrls = imageSearch.results.map((imageResult: { contentUrl: string; }) => imageResult.contentUrl);
          // Add in some of the search images for domain name
          imageResults = mergeImageUrls(imageUrls, domainNameImageUrls);
        } else {
          errors.push(imageSearch.error);
        }
      }
    } else {
      if (validate !== false) topImage = await getTopImage(imageResults);
    }
  }

  return {
    errors: errors,
    success: true,
    result: {
      siteData: siteData,
      imageSearch: imageSearchString,
      imageResults: imageResults,
      topImage: topImage,
      extraData: extraData
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

export default withAllowCORS(handler);