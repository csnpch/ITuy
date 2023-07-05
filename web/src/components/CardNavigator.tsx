import { Carousel } from 'antd';
import { StaticImageData } from 'next/image';

interface InterfaceProps {
    data: {
        title: string,
        pathImgs: StaticImageData[],
        statusActive: boolean
    },
    className?: string,
    classRounded?: string,
    classNameHeight?: string
}


export default function CardNavigator({ 
    data, 
    className, 
    classRounded, 
    classNameHeight 
}: InterfaceProps) {

    return (
        <>
            <div className={`
                ${className} ${classNameHeight} ${classRounded}
                relative group bg-black cursor-pointer overflow-hidden 
                shadow-[0_4px_4px_rgba(0,0,0,0.4)] transform duration-200 
                hover:shadow-[0_4px_4px_rgba(0,0,0,0.6)] active:shadow-[0_4px_4px_rgba(0,0,0,0.6)]
            `}>
                
                {/* Title */}
                <span className={`
                    ${data.statusActive ? 'text-white' : 'text-white/60'}
                    absolute z-20 bottom-4 left-4 font-light tracking-wider 
                `}>
                    {data.title}
                </span>

                {/* If not active show message tell user */}
                {
                    !data.statusActive &&
                    <div className={`
                        ${classRounded}
                        absolute z-20 w-full h-full flex-center text-2xl tracking-wider text-white/80
                    `}>
                        COMING SOON
                    </div>
                }

                {/* Overlay */}
                <div className={`
                    ${classRounded}
                    ${data.statusActive ? 'bg-gradient-to-t from-black/80 via-transparent' : 'bg-[#444]/70'}
                    absolute z-10 h-full w-full top-0 left-0 
                `} />

                {/* Image slide container */}
                <Carousel 
                    autoplay
                    dots={false}
                    effect='fade'
                >
                {
                    data.pathImgs.map((img, index) => {
                        return (
                            <img 
                                key={index}
                                src={`${img.src}`} alt=''
                                className={`
                                    ${classRounded} ${classNameHeight}
                                    select-none w-full h-full object-cover
                                `}
                            />
                        )
                    })
                }
                </Carousel>
            </div>
        </>
    )

}