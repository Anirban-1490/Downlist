import { memo } from "react";
import noitemStyle from "./NoItem.module.scss";

export const NoItem = memo(
    ({
        content,
        textColor,
        customStyleText,
        isForError = false,
        refetchFn,
    }) => {
        return (
            <>
                <div className={noitemStyle["no-item-content"]}>
                    <p
                        className={noitemStyle["no-item-text"]}
                        style={{
                            color: textColor || "#6a6969",
                            ...customStyleText,
                        }}>
                        {content || "Nothing to show here"}
                    </p>
                    {isForError && (
                        <button
                            onClick={refetchFn}
                            className={noitemStyle["refersh-btn"]}>
                            Retry
                        </button>
                    )}
                </div>
            </>
        );
    }
);

export const NoItemContiner = memo(
    ({ customContainerStyle, ...noItemProps }) => {
        return (
            <div
                className={noitemStyle["no-item-container"]}
                style={customContainerStyle}>
                {<NoItem {...noItemProps} />}
            </div>
        );
    }
);
