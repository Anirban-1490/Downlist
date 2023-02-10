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
        if (props.displyStyle === "flex-center-hv") {
            displyStyle = {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            };
        } else if (props.displyStyle === "flex") {
            displyStyle = {
                display: "flex",
            };
        } else {
            displyStyle = { display: "block" };
        }

        return {
            minHeight: props.minHeight || "100vh",
            ...displyStyle,
            position: props.position,
        };
    }
);
