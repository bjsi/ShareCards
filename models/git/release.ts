import * as t from "io-ts";
import * as D from "io-ts/Decoder";

export const asset = t.type({
  browser_download_url: t.string,
  size: t.number,
  download_count: t.number,
  name: t.string,
});

export const releaseData = t.type({
  name: t.string,
  published_at: t.string,
  assets: t.array(asset),
  body: t.string,
});

export type Release = D.TypeOf<typeof releaseData>;
