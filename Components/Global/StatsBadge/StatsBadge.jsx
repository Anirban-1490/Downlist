import StatsBadgeStyle from "Components/Global/StatsBadge/StatsBadge.module.scss";
import { AnyIcons } from "../AnyIcons/AnyIcons";

export function StatsBadge({
    content,
    contentStyle,
    badgeIcon,
    badgeIconStyle,
    badgeStyle = {},
}) {
    const { backgroundColor, borderRadius, padding } = badgeStyle;
    return (
        <div
            className={StatsBadgeStyle["badge"]}
            style={{
                backgroundColor: `${backgroundColor}`,
                borderRadius: `${borderRadius}`,
                padding: `${padding}`,
            }}>
            <AnyIcons badgeIcon={badgeIcon} badgeIconStyle={badgeIconStyle} />

            <p style={contentStyle}> {content || "??"}</p>
        </div>
    );
}
