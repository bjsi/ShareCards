import DisplayState from "../../Elements/Base/DisplayState";

enum DisplayAt {
  NonQuestion = DisplayState.Grading | DisplayState.Browsing,
  All = DisplayState.Question | DisplayState.Browsing | DisplayState.Grading,
}

export default DisplayAt;
