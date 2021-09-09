import { sanitizeUrl } from "@braintree/sanitize-url";

export const baseUrl = (process.env.SITE_URL || process.env.VERCEL_URL) ? (process.env.SITE_URL ? process.env.SITE_URL : "https://" + process.env.VERCEL_URL) : "";
export const invalidUrlString = "about:blank";

export function isString(x: any): x is string {
  return typeof x === "string";
}

export const isValidWebUrl = (url: any) => {
  if (sanitizeWebUrl(url) != invalidUrlString) {
    return true;
  } else {
    return false;
  }
}

export const sanitizeWebUrl = (url: any) => {
  if (isString(url) && (url.startsWith('https://') || url.startsWith('http://'))) {
    return sanitizeUrl(url);
  } else {
    return invalidUrlString;
  }
}

export const extractHostname = (url: string) => {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("//") > -1) {
      hostname = url.split('/')[2];
  }
  else {
      hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
}

export const stringToBoolParam = (inputParam: string | Array<string>) => {
  if (inputParam === 'true') {
    return true;
  } else if (inputParam === 'false') {
    return false;
  } else {
    throw ('Parameter must be boolean string - "true" or "false"');
  }
}
