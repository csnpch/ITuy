import { useEffect, useState } from 'react'
import { Theme, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import Marquee from "react-fast-marquee";

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        },
    },
}


interface dataSelectInterface {
    label: string,
    value: any,
    disable?: boolean
}


interface propsInterface {
    className?: string,
    label: string,
    dataSelect: dataSelectInterface[],
    defaultValue?: any[],
    marquee?: boolean,
    onSelected?: (value: any[]) => void,
}


export default function MultipleSelectChip({
    className,
    label,
    dataSelect,
    defaultValue,
    marquee = false,
    onSelected = () => {},
}: propsInterface) {

    const [valueSelect, setValueSelect] = useState<string[]>([])
    const [statusSetDefaultValue, setStatusSetDefaultValue]= useState<boolean>(false)

    useEffect(() => {
        if (!statusSetDefaultValue) {
            setStatusSetDefaultValue(true)
            setValueSelect(
                defaultValue || []
            )
            onSelected(valueSelect)
        }
    }, [defaultValue])


    const handleChange = (event: SelectChangeEvent<typeof valueSelect>) => {
        const {
            target: { value },
        } = event

        if (typeof value !== 'string') {
            setValueSelect(value)
            onSelected(value)
        } else {
            setValueSelect(value.split(','))
            onSelected(value.split(','))
        }
    }


    return (
        <FormControl className={`w-full ${className}`}>
            <InputLabel>
                <span className={`font_kanit`}>{ label }</span>
            </InputLabel>
            <Select
                multiple
                value={valueSelect}
                onChange={handleChange}
                input={<OutlinedInput label={`_${label}_`} />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                            <Chip key={value} label={value} className='px-4' />
                        ))}
                    </Box>
                )}
                MenuProps={MenuProps}
                variant='filled'
                defaultValue={defaultValue || []}
            >
                {dataSelect.map((item, index) => (
                    <MenuItem
                        key={index}
                        value={item.value}
                        disabled={item?.disable || false}
                    >
                        {
                            marquee ?
                            <Marquee
                                gradient={false}
                                delay={3}
                                speed={20}
                            >
                                { item.label }
                            </Marquee>
                            : item.label
                        }
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}