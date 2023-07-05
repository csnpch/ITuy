import Fab from '@mui/material/Fab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'


interface propsInterface {
    className?: string,
    triggerState: {
        valueIs: any,
        setValue: (value: any) => void
    }
}

export default function FloatingBtnAddBill({ 
    className = '',
    triggerState
}: propsInterface) {


    return (
        <>
            <Fab 
                onClick={() => triggerState.setValue(true)}
                color='primary' 
                aria-label='add'
                className={`z-30 fixed bottom-6 right-6 ${className}`} 
            >
                <FontAwesomeIcon icon={faPlus} className={`text-white text-xl`} />
            </Fab>
        </>
    );
}