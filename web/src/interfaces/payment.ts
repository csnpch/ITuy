export interface PaymentObjectInterface {
    payment: PaymentInterface[] | null,
    payment_method: PaymentMethodInterface[] | null,
}


export interface PaymentMethodInterface {
    id: string,
    client_id: string,
    target: string,
    method_identity: string,
    reserve_identity: string | null,
    promptpay: string,
    status: number | null,
    created_at: string,
    updated_at: string,
    // add-on
    owner_name?: string,
    owner_role?: number
}


export interface PaymentInterface {
    id: string,
    client_id: string,
    bill_id: string|null,
    img_evidence: string,
    relation_key: string|null,
    status: number,
    created_at: string,
    updated_at: string,
    // add-on
    updated_at_payment?: string,
}


export interface PaymentDetectInterface {
    payment_status: number | null
    id: string,
    payment_id: string,
    client_id: string,
    bill_id: string,
    img_evidence: string|null,
    relation_key: string|null,
    status: number|null,
    created_at: string,
    updated_at: string,
    target: string,
    title: string,
    description: string|null,
    amount: number,
    deadline: string|null,
    created_at_payment: string|null,
    updated_at_payment: string|null,
    // add-on
    status_payment: number|null,
    status_bill: number|null
}