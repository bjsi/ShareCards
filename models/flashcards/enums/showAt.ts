import { ShowState } from "./showState";

export enum ShowAt {
  NonQuestion = ShowState.Grading | ShowState.Browsing,
  All = ShowState.Question | ShowState.Browsing | ShowState.Grading,
}
