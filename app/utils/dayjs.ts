import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
export type { Dayjs } from "dayjs";

dayjs.extend(utc);
dayjs.extend(timezone);

export default dayjs;
