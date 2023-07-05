import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

interface propsInterface {
    className?: string,
    toggleState: {
        value: string,
        setValue: (value: togglePaymentStatusState) => void
    },
    totalItemOfStatus: {
        hold: number,
        hold_check: number,
        paid: number,
        callback: number
    },
    handleChange: (event: React.MouseEvent<HTMLElement>, value: togglePaymentStatusState) => void
}


export type togglePaymentStatusState = 'hold' | 'hold_check' | 'paid' | 'callback' 



export default function ToggleBtnStatusPayment({
    className = '',
    toggleState,
    handleChange,
    totalItemOfStatus
}: propsInterface) {
    return (
        <>

            <ToggleButtonGroup
                color='primary'
                value={toggleState.value}
                exclusive
                onChange={handleChange}
                aria-label='Platform'
                className={`w-full ${className}`}
            >
                <ToggleButton 
                    value='hold' 
                    className={`
                        w-full border-2 tracking-wide
                        ${
                            toggleState.value === 'hold' 
                            ? `bg-gray-600 text-white border-0`
                            : `bg-gray-200`
                        }
                    `}
                >
                    <p className='font_kanit flex flex-col'>
                        <span>รอชำระ</span> 
                        <span className={`text-[1.1rem]`}>
                            ({totalItemOfStatus.hold})
                        </span>
                    </p>
                </ToggleButton>
                <ToggleButton 
                    value='hold_check' 
                    className={`
                        w-full border-2 tracking-wide
                        ${
                            toggleState.value === 'hold_check' 
                            ? `bg-cyan-700 text-white border-0`
                            : `bg-gray-200`
                        }
                    `}
                >
                    <p className='font_kanit flex flex-col'>
                        <span>รอตรวจ</span> 
                        <span className={`text-[1.1rem]`}>
                            ({totalItemOfStatus.hold_check})
                        </span>
                    </p>
                </ToggleButton>
                <ToggleButton 
                    value='paid' 
                    className={`
                        w-full border-2 tracking-wide
                        ${
                            toggleState.value === 'paid' 
                            ? `bg-[#5B4FBE] text-white border-0`
                            : `bg-gray-200`
                        }
                    `}
                >
                    <p className='font_kanit flex flex-col'>
                        <span>ชำระแล้ว</span> 
                        <span className={`text-[1.1rem]`}>
                            ({totalItemOfStatus.paid})
                        </span>
                    </p>
                </ToggleButton>
                <ToggleButton 
                    value='callback' 
                    className={`
                        w-full border-2 tracking-wide
                        ${
                            toggleState.value === 'callback' 
                            ? `bg-red-800 text-white border-0`
                            : ` bg-gray-200`
                        }
                    `}
                >
                    <p className='font_kanit flex flex-col'>
                        <span>ไม่ผ่าน</span> 
                        <span className={`text-[1.1rem]`}>
                            ({totalItemOfStatus.callback})
                        </span>
                    </p>
                </ToggleButton>
            </ToggleButtonGroup>
        
        </>
    )
}
