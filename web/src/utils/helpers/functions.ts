import { MessageInstance } from 'antd/es/message/interface'
import { NotificationType } from '../../interfaces/share/antd'

// functions
export const openMessageNoti = (
    messageApi: MessageInstance, 
    type: NotificationType, 
    message: string, 
    duration?: number,
    className?: string
): void => {

    if (type === 'success') {
        messageApi.success({
            content: ` ${message}`,
            className: `font_mali_noti ${className}`,
            duration: duration || 3
        })
    } else if (type === 'error') {
        messageApi.error({
            content: ` ${message}`,
            className: `font_mali_noti ${className}`,
            duration: duration || 3
        })
    } else if (type === 'warning') {
        messageApi.warning({
            content: ` ${message}`,
            className: `font_mali_noti ${className}`,
            duration: duration || 3
        })
    } else if (type === 'info') {
        messageApi.info({
            content: ` ${message}`,
            className: `font_mali_noti ${className}`,
            duration: duration || 3
        })
    }

}

export const moneyFormat = (amount: number, unitDecimal: number = 2): string => {
    if (amount.toString().includes('.')) 
        return amount.toString()
    return amount.toLocaleString(undefined, {
        minimumFractionDigits: unitDecimal,
        maximumFractionDigits: unitDecimal,
    });
}

export const subString = (
    value: string, 
    length: number, 
    valueAfterSubString: string = ''
): string => {
    return value.substring(0, length) + (value.length >= length ? valueAfterSubString : '')
}

export const addZeroFrontIfMissing = (value: string, unitZeroFront = 2): string => {
    const zeroPad = '0'.repeat(unitZeroFront);
    const formattedValue = zeroPad + value;
    return formattedValue.substring(formattedValue.length - unitZeroFront);
}

export const timestrampFormat = (value: string, dateOnly = false): string => {
    if (value === '') return '-'

    let date_time = new Date(value)
    let day = date_time.getDay()
    let month = date_time.getMonth()
    let year = date_time.getFullYear()
    let hour = date_time.getHours()
    let minute = date_time.getMinutes()

    let dateFormat = addZeroFrontIfMissing(day.toString())
        + '/' + addZeroFrontIfMissing(month.toString())
        + '/' + addZeroFrontIfMissing(year.toString())

    if (dateOnly) 
        return dateFormat

    let timeFormat =
        addZeroFrontIfMissing(hour.toString())
        + ':' + addZeroFrontIfMissing(minute.toString())
    
    return dateFormat + ' . ' + timeFormat
}


export const getTextShowArray = (data: any): string => {

    let tmpString = '['

    data.forEach((item: any, index: number) => {
        tmpString += (index < data.length - 1) 
            ? item + ', '
            : item  
    });
    tmpString += ']'

    return tmpString

}