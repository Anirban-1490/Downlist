import styled from "@emotion/styled";

//* styled component to produce a container for jsx elements
export const Container = styled.div(
    {
        height: "auto",
        zIndex: 1,
        position: "relative",
    },
    (props) => {
        let displyStyle;
        displyStyle = (props.displyStyle === "flex-center-hv" && {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }) || {
            display: "block",
        };

        return {
            minHeight: props.minHeight || "100vh",
            ...displyStyle,
            position: props.position,
        };
    }
);
