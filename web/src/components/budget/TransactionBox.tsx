import { moneyFormat } from "@/utils/helpers/functions"

const classColorStatusText: {
    pass: string, 
    notPass: string, 
    inProcess: string
} = {
    pass: 'text-[#159700]',
    notPass: 'text-[#FF0000]',
    inProcess: 'text-[#FF00C7]'
}



interface propsInterface {
    item?: any|null,
    title: string,
    subTitle?: string|React.ReactNode,
    amount?: number|string,
    bottomLine?: boolean,
    statusTnx?: number,
    textStatusTnx?: string|React.ReactNode,
    className?: string,
    classNameTitle?: string,
    classNameSubTitle?: string,
    classStatusTnx?: string,
    classAmount?: string,
    disableHoverActive?: boolean,
    onClick?: (item: any) => void
}


export default function TransactionBox({
    item = null,
    title,
    subTitle = '',
    amount,
    bottomLine = false,
    statusTnx = 0,
    textStatusTnx = '',
    className = '',
    classNameTitle = '',
    classNameSubTitle = '',
    classStatusTnx = '',
    classAmount = '',
    disableHoverActive = false,
    onClick = () => {},
}: propsInterface) {


    return <>
    
        <div 
            onClick={() => onClick(item)}
            className={`
                flex flex-row justify-between text-[0.8rem] px-2 py-4
                ${!disableHoverActive && 'hover:bg-black/5 active:bg-black/5 cursor-pointer'}
                ${className}
            `}
        >
            <div className={`flex flex-col justify-start ${subTitle && 'justify-between'}`}>
                <p className={`
                    w-full text-left 
                    ${classNameTitle}
                `}>
                    { title }
                </p>
                <p className={`
                    w-full text-left text-xs text-[#7A7A7A] ${subTitle && 'mt-2'}
                    ${classNameSubTitle}    
                `}>
                    { subTitle || '' }
                </p>
            </div>

            <div className={`
                flex flex-col gap-y-2.5
                ${
                    !textStatusTnx
                    ? 'justify-center'
                    : 'justify-end'
                }
            `}>
                {
                    typeof amount === 'number' &&
                    <p className={`
                        w-full text-right tracking-wider
                        ${classAmount}
                    `}>
                        <span>฿</span>{ moneyFormat(amount || 0) || '0.00'}
                    </p>
                }
                {
                    typeof amount === 'string' &&
                    <p className={`
                        w-full text-right tracking-wider
                        ${classAmount}
                    `}>
                        { amount }
                    </p>
                }
                {
                    !textStatusTnx ||
                    <p className={`
                        w-full text-right text-xs tracking-wide
                        ${classStatusTnx || ''}
                        ${
                            statusTnx === 1
                            && classColorStatusText.inProcess
                        }
                    `}>
                        { textStatusTnx }
                    </p>
                }
            </div>
        </div>

        {
            bottomLine &&
            <div className={`py-[0.028rem] w-full bg-[#BFBFBF]`} />
        }

    </>
}