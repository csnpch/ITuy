export interface dataRoutesInterface {
    title: {
        en: string
        th: string,
    },
    titleShow?: string,
    slug: string,
    path: string,
    icon: (className?: string) => JSX.Element,
    statusActive: boolean,
    statusShowOnSidebar?: boolean,
    routeProtectLevel: (number | null)[]|null,
    ignoreProtect?: boolean,
    staffOnly?: boolean,
}