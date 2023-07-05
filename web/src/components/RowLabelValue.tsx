import { moneyFormat } from "@/utils/helpers/functions"

interface propsInterface {
    label: string,
    value: string | number,
    className?: string,
    labelClassName?: string,
    valueClassName?: string,
    isNumber?: boolean
}

export default function RowTiteValue({
    label,
    value,
    className = '',
    labelClassName = '',
    valueClassName = '',
    isNumber = false
}: propsInterface) {
    return (
        <>
            <div className={`
                flex flex-row justify-between items-center
                tracking-wide ${className}
            `}>
                <p className={`${labelClassName}`}>
                    { label }
                </p>
                {
                    <p className={`${valueClassName}`}>
                        {
                            isNumber &&
                            <>
                                <span>฿</span>&nbsp;
                            </>
                        }
                        { value }
                    </p>
                }
            </div>
        </>
    )
}