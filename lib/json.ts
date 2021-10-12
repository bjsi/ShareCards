import * as J from "fp-ts/Json";
import * as F from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";

export const jsonify = F.flow(
  J.stringify,
  E.mapLeft(e =>
    e instanceof Error ? e : new Error("Failed to stringify JSON."),
  ),
);

export const parseJSON = F.flow(
  J.parse,
  E.mapLeft(e => (e instanceof Error ? e : new Error("Failed to parse JSON."))),
);
