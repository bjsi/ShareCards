import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export const humanRelativeDate = (value: string | number | Date) =>
  dayjs(new Date(value)).fromNow();
