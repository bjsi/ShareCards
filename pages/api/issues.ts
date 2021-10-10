import { getIssues } from "../../services/gitService";
import { Issue } from "../../models/issue";
import { handleMethods, ApiResponse } from "../../lib/handleMethods";
import * as F from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";

export default handleMethods<{ user: string; repo: string }>()
  .get<Issue[]>(async (req, res) => {
    await F.pipe(
      getIssues(req.query.user, req.query.repo),
      TE.fold(
        e => T.of(res.status(400).json({ result: false, data: String(e) })),
        issues => T.of(res.json({ result: true, data: issues })),
      ),
    )();
  })
  .prepare();
