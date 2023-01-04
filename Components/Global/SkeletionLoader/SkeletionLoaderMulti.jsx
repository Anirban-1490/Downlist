import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import skeletonStyle from "Components/Global/SkeletionLoader/Skeletion.module.scss";

export function SkeletonLoaderMulti() {
    return (
        <>
            <div className={skeletonStyle["skeletion-wrapper"]}>
                {
                    <SkeletonTheme
                        inline={true}
                        width={"11em"}
                        height={"14em"}
                        baseColor={"#302c2c"}
                        highlightColor={"#636161"}>
                        <Skeleton
                            count={8}
                            containerClassName={
                                skeletonStyle["skeleton-wrapper-inner"]
                            }
                            className={skeletonStyle["skeleton-custom"]}
                        />
                    </SkeletonTheme>
                }
            </div>
        </>
    );
}
