import { ScrapeOptions } from "../lib/scrape";
import { AmazonData, amazonUrls, getAmazonData } from "../lib/amazon";

interface ExceptionSiteData {
  scrapeOptions?: ScrapeOptions
  extraData?: ExtraData
}

export interface ExtraData {
  amazon?: AmazonData
}

const twitterUrls = [
  "https://twitter.",
  "http://twitter."
]

export const isExceptionSite = (url: string, exceptionUrls: Array<string>) => {
  let isExceptionSite = false;
  exceptionUrls.forEach((exceptionUrl) => {
    if (url.startsWith(exceptionUrl)) {
      isExceptionSite = true;
    }
  });
  return isExceptionSite;
}

// Depending on exception sites, change scrape options and assign extra data
// Currently this API contains exceptions for sites such Amazon, Twitter, etc.
export const getExceptionSiteData = async (url: string, stealth?: boolean) => {

  let exceptionData: ExceptionSiteData = {};

  // If amazon site, get amazon data using https://webservices.amazon.com/paapi5/documentation/
  if (isExceptionSite(url, amazonUrls)) {
    exceptionData = {
      extraData: {
        amazon: await getAmazonData(url)
      }
    }
  }

  // If twitter site, make stealth scrape wait until no more than 0 network connections for at least 500 ms
  if (isExceptionSite(url, twitterUrls)) {
    exceptionData = {
      scrapeOptions: {
        scrape: true,
        stealth: stealth,
        stealthOptions: {
          gotoOptions: {
            waitUntil: "networkidle0"
          }
        }
      }
    }
  }

  return exceptionData;

}