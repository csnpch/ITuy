import { MenuItem, Select } from '@mui/material'
import { ReactNode, useState } from 'react'
import { SelectChangeEvent } from '@mui/material'


interface propsInterface {
    label: string,
    items: any[],
    defaultValue?: any,
    className?: string,
    labelClassName?: string,
    itemClassName?: string,
    onSelected?: (value: any) => void
}

export default function LabelSelectShortValue({
    label,
    items = [],
    defaultValue,
    className = '',
    labelClassName = '',
    itemClassName = '',
    onSelected = () => {}
}: propsInterface) {

    const [value, setValue] = useState<string>(defaultValue)
    

    return (
        <>

            <div className={`
                w-full flex-center gap-x-2 select-none ${className}
            `}>
                {/* ${needSearch && 'hidden'} */}
                <span className={`w-full tracking-wide ${labelClassName}`}>
                    { label }
                </span>
                <Select
                    value={value}
                    label="YEAR OF STUDENT"
                    className={`w-min px-4 h-10 text-blue-800 text-lg capitalize`}
                    onChange={(event) => {
                        setValue(event.target.value)
                        onSelected(event.target.value)
                    }}
                >
                    {
                        items.map((item, index) => {
                            return (
                                <MenuItem 
                                    key={index} 
                                    value={item}
                                >
                                    <span className={`${itemClassName} capitalize`}>
                                        { item }
                                    </span>
                                </MenuItem>
                            )
                        })
                    }
                </Select>
            </div>

        </>
    )
}