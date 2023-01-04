import { TouchCarousel } from "Components/Global/TouchCarousel/TouchCarousel";
import react from "react";
import mainSectionStyle from "Components/Top/style/StyledMainSection.module.scss";
import { SkeletonLoaderMulti } from "Components/Global/SkeletionLoader/SkeletionLoaderMulti";

export const StyledSection = react.memo(
    ({
        data,
        switch_details,
        text_,
        headerColor,
        subHeadingText,
        subHeaderColor = "#ffffffa7",
    }) => {
        return (
            <>
                <div className={mainSectionStyle["section-wrapper"]}>
                    <h2 style={{ color: headerColor }}>
                        {text_}
                        <h4 style={{ color: subHeaderColor }}>
                            {subHeadingText}
                        </h4>
                    </h2>

                    {!data ? (
                        <SkeletonLoaderMulti />
                    ) : (
                        <TouchCarousel
                            items={data}
                            switch_details={switch_details}
                        />
                    )}
                </div>
            </>
        );
    }
);
