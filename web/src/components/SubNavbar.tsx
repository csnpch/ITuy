import Link from "next/link";

// Icons
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { dataRoutesInterface } from "@/interfaces/routes";

interface propsInterface {
    setOpenSidebar?: (value: boolean) => void,
    className?: string,
    previousRoute?: dataRoutesInterface,
    currentRoute?: dataRoutesInterface
}


export default function SubNavbar({ 
    setOpenSidebar = () => {},
    className = '',
    previousRoute,
    currentRoute
}: propsInterface) {
    

    return (
        <>
            <div className={`
                container-sub-nav space-horizontal ${className}
            `}>
                <Link 
                    href={previousRoute?.path || '#'}
                    onClick={() => {}}
                    className={`
                        icon-previous w-min h-full flex justify-start items-center //bg-black
                    `}
                >
                    <FontAwesomeIcon icon={faChevronLeft} 
                        className='text-white text-xl'
                    />
                </Link>
                <span className={`
                    title_sub_sidebar text-center font_kanit text-lg tracking-wider logo-color-dark
                    flex justify-center items-center
                `}>
                    { currentRoute?.titleShow || currentRoute?.title.th || '' }
                </span>
                <div
                    onClick={() => setOpenSidebar(true)}
                    className={
                        `btn_sub_sidebar flex justify-start items-center logo-color-dark cursor-pointer //bg-black`
                    }
                >
                    <HiOutlineMenuAlt4 className={`
                        text-3xl
                    `} />
                </div>
            </div>
        </>
    );

}
