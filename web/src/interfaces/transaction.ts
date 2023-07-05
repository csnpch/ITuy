export interface transactionInterface {

    id: string
    client_id: string
    title: string
    description: string|null
    link_evidence: string|null
    amount: number
    vote_id: string|null
    status: number|null
    created_at: string
    updated_at: string,
    // add-on
    owner_name: string
    tnx_id: string,
    tnx_created_at: string,
}