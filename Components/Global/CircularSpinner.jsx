const { SpinnerCircularFixed } = require("spinners-react");

export function CircularSpinner({
    enabled,
    size,
    color = "#da9109",
    secondaryColor = "rgba(0 ,0,0,0.2)",
}) {
    return (
        <SpinnerCircularFixed
            enabled={enabled}
            color={color}
            secondaryColor={secondaryColor}
            size={size}
        />
    );
}
