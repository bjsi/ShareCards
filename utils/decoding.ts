import { failure } from "io-ts/lib/PathReporter";
import * as t from "io-ts";
import * as F from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";

export const decodeWith = <A>(decoder: t.Decoder<unknown, A>) =>
  F.flow(
    decoder.decode,
    E.mapLeft(errors => new Error(failure(errors).join("\n"))),
    TE.fromEither,
  );
