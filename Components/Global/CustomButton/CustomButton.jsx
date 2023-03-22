/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import customBtnStyle from "Components/Global/CustomButton/CustomButtonStyle.module.scss";

export const CustomButton = ({
    type = "button",
    children,
    className,

    disabled = false,
    title,
    id,
    customAriaLabel = id,
    backgroundColor,
    color,
    onClick,
}) => {
    return (
        <button
            css={{
                backgroundColor: `${backgroundColor}`,
                color: `${color}`,
            }}
            aria-labelledby={customAriaLabel}
            className={`${customBtnStyle["custom-btn"]} ${className}`}
            type={type}
            disabled={disabled}
            title={title}
            id={id}
            onClick={onClick}>
            {children}
        </button>
    );
};
