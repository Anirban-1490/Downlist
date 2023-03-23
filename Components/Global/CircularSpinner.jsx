/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const { SpinnerCircularFixed } = require("spinners-react");

export function CircularSpinner({
    enabled,
    size,
    color = "#da9109",
    secondaryColor = "transparent",
}) {
    return (
        <div css={{ display: "flex", justifyContent: "center" }}>
            <SpinnerCircularFixed
                enabled={enabled}
                color={color}
                secondaryColor={secondaryColor}
                size={size}
            />
        </div>
    );
}
