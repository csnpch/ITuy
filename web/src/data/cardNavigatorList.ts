import { routes } from './dict/routes_dict';
import { dataCardNavigator } from './../interfaces/data';

// Resources
import ImageMoney from '@/assets/imgs/money.webp'
import ImageFood from '@/assets/imgs/food.webp'
import ImageMap from '@/assets/imgs/map.webp'
import ImageDocs from '@/assets/imgs/documents.webp'
import ImageBoard from '@/assets/imgs/board_of_directors.webp'


export const cardNavigatorList: dataCardNavigator[] = [
    // Butget
    {
        title: routes.budget.title.th,
        pathImgs: [ ImageMoney ],
        pathLink: routes.budget.path,
        slug: `budget`,
        statusActive: routes.budget.statusActive,
        routeProtectLevel: routes.budget.routeProtectLevel
    },
    // Location
    {
        title: routes.location.title.th,
        pathImgs: [ ImageFood, ImageMap ],
        pathLink: routes.location.path,
        slug: `location`,
        statusActive: routes.location.statusActive,
        routeProtectLevel: routes.location.routeProtectLevel
    },
    // Board
    {
        title: routes.board.title.th,
        pathImgs: [ ImageBoard ],
        pathLink: routes.board.path,
        slug: `board`,
        statusActive: routes.board.statusActive,
        routeProtectLevel: routes.board.routeProtectLevel
    },
    // Document
    {
        title: routes.document.title.th,
        pathImgs: [ ImageDocs ],
        pathLink: routes.document.path,
        slug: `document`,
        statusActive: routes.document.statusActive,
        routeProtectLevel: routes.document.routeProtectLevel
    }
]

