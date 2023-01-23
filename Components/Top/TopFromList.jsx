import { Spinner } from "Components/Global/LoadingSpinner";
import { NoItemContiner } from "Components/Global/NoItemFound/NoItemFound";
import { SkeletonLoaderMulti } from "Components/Global/SkeletionLoader/SkeletionLoaderMulti";
import topFromListStyle from "Components/Top/style/TopList.module.scss";
import { useToplist } from "Hooks/useTopList";
import { useWindowResize } from "Hooks/useWindowResize";
import Link from "next/link";

export const TopFromlist = ({ switchLists, userId }) => {
    const [listItems, isError, isLoading, refetch] = useToplist(
        switchLists,
        userId
    );
    const windowWidth = useWindowResize();

    const styleProps =
        windowWidth > 960
            ? { width: "33.3%", margin: "0" }
            : { width: "100%", height: "24em", margin: "0" };

    return (
        <>
            <div className={topFromListStyle["main-container"]}>
                {isLoading && (
                    <SkeletonLoaderMulti
                        skeletonCount={3}
                        skeletonHeight={"34em"}
                        skeletonWidth={"33.3%"}
                        columnMobile={true}
                    />
                )}
                {!isLoading && !listItems?.length && !isError && (
                    <NoItemContiner />
                )}
                {isError && (
                    <NoItemContiner
                        content="Something went wrong, please try again"
                        isForError={true}
                        refetchFn={refetch}
                    />
                )}

                {!isLoading && listItems?.length && (
                    <div className={topFromListStyle["inner-container"]}>
                        {listItems.map((item) => {
                            if (!item)
                                return (
                                    <NoItemContiner
                                        customContainerStyle={styleProps}
                                        content={
                                            switchLists == "anime"
                                                ? "Add some more anime to your list"
                                                : "Add some more characters to your list"
                                        }
                                    />
                                );

                            const {
                                about,
                                img_url,
                                title,
                                malid,
                                large_img_url,
                            } = item;
                            return (
                                <Link
                                    href={
                                        switchLists == "anime"
                                            ? `/anime/${malid}`
                                            : `/character/${malid}`
                                    }
                                    key={malid}>
                                    <a
                                        className={
                                            topFromListStyle["items-container"]
                                        }>
                                        <img
                                            src={large_img_url || img_url}
                                            className={
                                                topFromListStyle[
                                                    "img-container"
                                                ]
                                            }
                                            alt=""
                                        />

                                        <div
                                            className={
                                                topFromListStyle[
                                                    "info-container"
                                                ]
                                            }>
                                            <h2
                                                className={
                                                    topFromListStyle["title"]
                                                }>
                                                {title}
                                            </h2>
                                            <p
                                                className={
                                                    topFromListStyle["about"]
                                                }>
                                                {about}
                                            </p>
                                        </div>
                                    </a>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
};
