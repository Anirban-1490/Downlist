import activityStyle from "Components/Profile/Style/Activity.module.scss";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { useMemo } from "react";

export const Activity = ({ activity, windowSize }) => {
    const timeAgo = useMemo(() => {
        TimeAgo.addDefaultLocale(en);
        return new TimeAgo("en-US");
    }, []);
    const colorsBG = {
        Added: "#008000a7",
        Removed: "#a82828b3",
        Modified: "#6f6e6eb3",
    };
    const colorsFG = {
        Added: "#62d262",
        Removed: "#e17878",
        Modified: "#a6a6a6",
    };

    return (
        <>
            <article className={activityStyle["activity"]}>
                <div className={activityStyle["activities-container"]}>
                    {activity.length > 0 ? (
                        activity.map(({ actDone, detail, doneAt }) => {
                            return (
                                <div
                                    key={doneAt}
                                    className={
                                        activityStyle["activity-item-container"]
                                    }>
                                    <div
                                        className={
                                            activityStyle["act-container"]
                                        }>
                                        <div
                                            className={activityStyle["act"]}
                                            style={{
                                                color: colorsFG[actDone],
                                                backgroundColor:
                                                    colorsBG[actDone],
                                            }}>
                                            {actDone}
                                        </div>
                                    </div>
                                    <div className={activityStyle["title"]}>
                                        {detail}
                                    </div>
                                    <div className={activityStyle["time-ago"]}>
                                        {windowSize > 581
                                            ? timeAgo.format(
                                                  new Date(doneAt),
                                                  "round"
                                              )
                                            : timeAgo.format(
                                                  new Date(doneAt),
                                                  "mini-minute-now"
                                              )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <h3 className={activityStyle["empty-container"]}>
                            Looks pretty empty...
                        </h3>
                    )}
                </div>
            </article>
        </>
    );
};
