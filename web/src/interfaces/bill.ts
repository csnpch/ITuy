import { ClientInterface } from '@/interfaces/client';
import { PaymentInterface } from './payment';

export interface BillObjectInterface {
    dataBill?: BillInterface[] | null,
    pagination?: PaginationBillInterface | null
}


export interface BillInterface {
    id: string,
    client_id: string,
    target: string[] | null,
    title: string,
    description?: string | null,
    amount: number,
    deadline: string,
    status: number | null,
    created_at: string,
    updated_at: string,
    // add-on
    owner_name: string,
    recipient: recipientInterface
}


export interface PaginationBillInterface {
    pageSize: number,
    currentPage: number,
    itemPerPage: number
}


export interface dataRecipientsInterface extends ClientInterface, PaymentInterface {}


export interface recipientInterface {
    paid: {
        data: dataRecipientsInterface[],
        count: number
    },
    hold_check: {
        data: dataRecipientsInterface[],
        count: number
    },
    hold: {
        data: dataRecipientsInterface[],
        count: number
    },
    callback: {
        data: dataRecipientsInterface[],
        count: number
    },
    totalCount: number
}