interface propsInterface {
    title: string,
    titleCenter?: boolean,
    totalAmount?: string,
    bracketText?: string,
    className?: string,
    classNameTitle?: string
    classBrackerText?: string,
    classNameTotalAmount?: string
}


export default function TransactionCallbackTitle({
    title,
    titleCenter = false,
    totalAmount,
    bracketText = '',
    className = '',
    classNameTitle = '',
    classBrackerText = '',
    classNameTotalAmount = ''
}: propsInterface) {


    return (
        <>
            <div className={`
                w-full justify-between items-center 
                ${!titleCenter && 'flex'}
                ${className}
            `}>
                <p className={`${classNameTitle}`}>
                    { title }
                    &nbsp;&nbsp;
                    {
                        (bracketText) && 
                        <span className={`${classBrackerText}`}>
                            {`(`} { bracketText } {`)`}
                        </span> 
                    }
                </p>
                {
                    totalAmount &&
                    <p className={`${classNameTotalAmount}`}>
                        <span>฿</span>
                        &nbsp;
                        { totalAmount }
                    </p>
                }
            </div>

        
        </>
    )
}