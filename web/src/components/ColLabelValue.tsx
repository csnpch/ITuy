interface propsInterface {
    label: string,
    value?: string|React.ReactNode,
    className?: string,
    labelClassName?: string,
    valueClassName?: string,
    disableItemsCenter?: boolean
}


export default function ColTitleValue({
    label,
    value = '',
    className = '',
    labelClassName = '',
    valueClassName = '',
    disableItemsCenter = false
}: propsInterface) {

    return (
        <>
        
            <div className={`
                flex flex-col justify-between 
                ${disableItemsCenter ? '' : 'items-center'}
                tracking-wide gap-y-2 ${className}
            `}>
                <p className={`${labelClassName}`}>
                    { label }
                </p>
                <p className={`${valueClassName}`}>
                    { value }
                </p>
            </div>
        
        </>
    )
    
}