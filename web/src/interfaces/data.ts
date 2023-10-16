import { StaticImageData } from "next/image";

export interface dataCardNavigator {
    title: string,
    pathImgs: StaticImageData[],
    pathLink: string,
    slug: string,
    statusActive: boolean,
    routeProtectLevel: (number | null)[]|null
}