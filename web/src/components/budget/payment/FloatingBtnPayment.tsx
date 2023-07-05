import Fab from '@mui/material/Fab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet } from '@fortawesome/free-solid-svg-icons'
import { Tooltip } from 'antd';


interface propsInterface {
    className?: string,
    triggerState: {
        valueIs: any,
        setValue: (value: any) => void
    },
    tooltipText?: string,
    openTooltip?: boolean
}

export default function FloatingBtnPayment({ 
    className = '',
    triggerState,
    tooltipText = '',
    openTooltip = false
}: propsInterface) {


    return (
        <>
            <Tooltip 
                placement="left" title={tooltipText} 
                open={openTooltip}
                color='red'
            >
                <Fab 
                    onClick={() => triggerState.setValue(true)}
                    color='primary' 
                    aria-label='add'
                    className={`z-30 fixed bottom-6 right-6 ${className}`} 
                >
                    <FontAwesomeIcon icon={faWallet} className={`text-white text-xl`} />
                </Fab>
            </Tooltip>
        </>
    );
}