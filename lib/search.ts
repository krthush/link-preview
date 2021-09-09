import { Method } from "axios";
import psl from "psl";

import api from "./api";

import { extractHostname } from "../utils";

export const getImageSearchString = (title: string, url: string, siteName?: string) => {
  
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

export const getBingImageSearch = async (search: string): Promise<{ results?: Array<any>, error?: any }> => {
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