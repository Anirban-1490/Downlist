import { memo } from "react";
import noitemStyle from "./NoItem.module.scss";

export const NoItem = memo(({ content, textColor, customStyleText }) => {
    return (
        <p
            className={noitemStyle["no-item-main"]}
            style={{ color: textColor || "#6a6969", ...customStyleText }}>
            {content || "Nothing to show here"}
        </p>
    );
});

export const NoItemContiner = memo(
    ({ content, textColor, customContainerStyle, customStyleText }) => {
        return (
            <div
                className={noitemStyle["no-item-container"]}
                style={customContainerStyle}>
                {
                    <NoItem
                        content={content}
                        textColor={textColor}
                        customStyleText={customStyleText}
                    />
                }
            </div>
        );
    }
);
