import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
    "delete any old files marked for deletion",
    { hours: 168 }, // 7 days
    internal.files.autoDeleteFiles
);

crons.interval(
    "delete expired global files",
    { minutes: 1 },
    internal.files.deleteExpiredGlobalFiles
);

export default crons;