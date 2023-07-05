import * as yup from 'yup'
import { Shape } from '@/interfaces/share/yup'


export interface formAuthInterface {
    username: string,
    password: string
}

export const validationFormAuthSchema = yup.object<Shape<formAuthInterface>>({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required')
})



export interface formReceiveInfoInterface {
    nickname: string,
    fullname: string
}

export const validationFormReceiveInfoSchema = yup.object<Shape<formReceiveInfoInterface>>({
    nickname: yup.string()
        .required('โปรดระบุชื่อเล่น')
        .matches(/^[\u0E00-\u0E7F\s]+$/, 'โปรดระบุชื่อเล่นเป็นภาษาไทย'),
    fullname: yup.string()
        .required('โปรดระบุชื่อ-นามสกุล')
        .matches(/^[\u0E00-\u0E7F\s]+$/, 'โปรดระบุชื่อ-นามสกุลเป็นภาษาไทย'),
})



export interface formAddPaymentMethodInterface {
    target: string,
    promptpay: string,
    method_identity: string,
    reserve_identity: string,
}

export const validationFormAddPaymentMethodSchema = yup.object<Shape<formAddPaymentMethodInterface>>({
    target: yup.string()
        .required('โปรดเลือกชั้นปีสำหรับช่องทางชำระเงินนี้'),
    promptpay: yup.string()
        .required('โปรดระบุหมายเลขพร้อมเพย์')
        .matches(/^[0-9]+$/, 'ระบุเป็นหมายเลขพร้อมเพย์ตัวเลขเท่านั้น')
        .min(10, 'หมายเลขพร้อมเพย์ควรมีอย่างน้อย 10 หลัก'),
    method_identity: yup.string()
        .required('โปรดระบุผู้ครอบครองบัญชี')
        .min(8, 'ข้อมูลผู้ครอบครองบัญชีควรยาวกว่านี้')
})



export interface formAddBillInterface {
    target: number[],
    title: string,
    description?: string,
    amount: string,
    deadline: string,
}

export const validationFormAddBillSchema = yup.object<Shape<formAddPaymentMethodInterface>>({
    title: yup.string()
        .required('โปรดระบุชื่อบิล')
        .min(8, 'ข้อมูลผู้ครอบครองบัญชีควรยาวกว่านี้'),
    amount: yup.string()
        .required('โปรดระบุจำนวนเงิน')
        .matches(/^\d*\.?\d+$/, 'จำนวนเงินไม่ถูกต้อง')
})




export interface formAddTnxInterface {
    title: string,
    description?: string,
    amount: string,
    link_evidence: string|null
}

export const validationFormAddTnxSchema = yup.object<Shape<formAddPaymentMethodInterface>>({
    title: yup.string()
        .required('โปรดระบุชื่อธุรกรรม')
        .min(4, 'ชื่อธุรกรรมควรยาวกว่านี้'),
    amount: yup.string()
        .required('โปรดระบุจำนวนเงินที่เบิก')
        .matches(/^\d*\.?\d+$/, 'จำนวนเงินไม่ถูกต้อง'),
    link_evidence: yup.string()
        .required('โปรดแนบหลักฐานการเบิกเงิน')
})