import StatsBadgeStyle from "Components/Global/StatsBadge/StatsBadge.module.scss";

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
            <ion-icon style={badgeIconStyle} name={`${badgeIcon}`}></ion-icon>
            <p style={contentStyle}> {content || "??"}</p>
        </div>
    );
}
