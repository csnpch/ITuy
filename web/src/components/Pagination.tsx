import { Button } from "antd";
import { useEffect, useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';


interface propsInterface {
    className?: string,
    currentPage?: number,
    pageCount: number,
    onPage: (page: number) => void
} 


export default function Pagination({
    className = '',
    currentPage = 1,
    pageCount,
    onPage
}: propsInterface) {

    const [noPage, setNoPage] = useState<number>(currentPage)

    
    useEffect(() => {
        onPage(noPage)
    }, [noPage])


    const handleChangePage = (state: string) => {
        if (state === 'decrement') {
            if (noPage - 1 <= 0) return
            setNoPage(prevState => prevState - 1)
        }
        else if (state === 'increment') {
            if (noPage + 1 > pageCount) return
            setNoPage(prevState => prevState + 1)
        }
    }
    

    return (
        <>
        
            <div className={`w-full flex-center gap-x-2 select-none ${className}`}>
                <Button 
                    type="text" 
                    shape="circle" 
                    icon={<AiOutlineLeft />} 
                    onClick={() => handleChangePage('decrement')}
                />
                <p className={`-mt-0.5 flex-center items-center gap-x-1 font-light`}>
                    <span className={`mr-1.5`}>Page</span>
                    <span>{ noPage }</span>
                    <span>/</span>
                    <span>{ pageCount }</span>
                </p>
                <Button 
                    type="text" 
                    shape="circle" 
                    icon={<AiOutlineRight />} 
                    onClick={() => handleChangePage('increment')}
                />
            </div>
        
        </>
    )
}