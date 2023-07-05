export interface ClientInterface {
    id: string,
    email?: string | null,
    nickname?: string | null,
    fullname?: string | null,
    branch?: string | null,
    role: number | null,
    description: string | null,
    username: string,
    section: number|null,
    created_at: string,
    updated_at: string
}


export interface ClientObjectInterface {
    dataClient?: ClientInterface | null
}