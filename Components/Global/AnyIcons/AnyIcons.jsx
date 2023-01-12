export function AnyIcons({ children, badgeIconStyle, badgeIcon }) {
    return (
        <ion-icon style={badgeIconStyle} name={`${badgeIcon}`}>
            {children}
        </ion-icon>
    );
}
