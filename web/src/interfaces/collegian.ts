export interface CollegianObjectInterface {
    section: SectionInterface[] | null,
    yearStd: number[] | null
}


export interface SectionInterface {
    id: string,
    sec: number,
    sec_name: string,
    description: string | null,
    created_at: string,
    updated_at: string
}
