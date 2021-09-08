import { NextApiRequest, NextApiResponse } from "next";
import { isString } from "../utils";

export interface LinkParamsRequest extends NextApiRequest {
  params: {
    url: string
    stealth?: boolean
    search?: boolean
  }
}

const withLinkPreviewQuery = (handler: (req: LinkParamsRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: LinkParamsRequest, res: NextApiResponse) => {
    const { url, stealth, search } = req.query;
    if (stealth) {
      if (stealth === 'true') {
        req.params.stealth = true;
      } else if (stealth === 'false') {
        req.params.stealth = false;
      } else {
        return res.status(400).json({ success: false, error: 'Stealth parameter must be boolean - true or false.' });
      }
    }
    if (search) {
      if (search === 'true') {
        req.params.search = true;
      } else if (search === 'false') {
        req.params.search = false;
      } else {
        return res.status(400).json({ success: false, error: 'Search parameter must be boolean - true or false.' });
      }
    }
    if (url && isString(url)) {
      req.params.url = url;
      return handler(req, res);
    } else {
      return res.status(400).json({ success: false, error: 'Url base64 encoded string required. Only non array string parameter allowed.' });
    }
  }
}

export default withLinkPreviewQuery;