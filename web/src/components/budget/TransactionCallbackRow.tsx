interface propsInterface {
    title: string,
    price: string,
    classNameTitle?: string,
    classNamePrice?: string
}

export default function TransactionCallbackRow({
    title,
    price,
    classNameTitle = '',
    classNamePrice = ''
}: propsInterface) {
    return (
        <>
            <div className={`flex justify-between text-[#423C74]`}>
                <p className={`${classNameTitle}`}>
                    { title }
                </p>
                <p className={`${classNamePrice}`}>
                    <span>฿</span>
                    &nbsp;
                    { price }
                </p>
            </div>
        </>
    )
}