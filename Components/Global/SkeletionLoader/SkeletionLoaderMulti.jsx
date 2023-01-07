import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import skeletonStyle from "Components/Global/SkeletionLoader/Skeletion.module.scss";

export function SkeletonLoaderMulti({
    skeletonCount = 8,
    skeletonWidth = "11em",
    skeletonHeight = "14em",
    columnNormal = false,
    columnMobile = false,
}) {
    const classForColumnNormal = columnNormal
        ? "column-normal"
        : columnMobile
        ? "column-mobile"
        : "";

    return (
        <>
            <div className={skeletonStyle["skeletion-wrapper"]}>
                {
                    <SkeletonTheme
                        inline={true}
                        width={skeletonWidth}
                        height={skeletonHeight}
                        baseColor={"#302c2c"}
                        highlightColor={"#636161"}>
                        <Skeleton
                            count={skeletonCount}
                            containerClassName={`${skeletonStyle["skeleton-wrapper-inner"]} ${skeletonStyle[classForColumnNormal]}`}
                            className={`${skeletonStyle["skeleton-custom"]} ${skeletonStyle[classForColumnNormal]}`}
                        />
                    </SkeletonTheme>
                }
            </div>
        </>
    );
}
