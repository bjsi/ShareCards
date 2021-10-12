import ShowState from './showState';

const enum ShowAt {
  NonQuestion = ShowState.Grading | ShowState.Browsing,
  All = ShowState.Question | ShowState.Browsing | ShowState.Grading,
};

export default ShowAt;
