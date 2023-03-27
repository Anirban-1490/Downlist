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
    customAriaLabel,
    backgroundColor,
    color,
    onClick,
    dataAttrKey,
    dataAttrValue,
}) => {
    return (
        <button
            css={{
                backgroundColor: `${backgroundColor}`,
                color: `${color}`,
            }}
            {...{ [`data-${dataAttrKey}`]: dataAttrValue }}
            aria-labelledby={customAriaLabel || id}
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
