interface keyVal {
    slug: string,
    numStr: string
}

export interface SectionDictInterface {
    a: keyVal,
    b: keyVal,
    c: keyVal,
    other: keyVal
}


export const section_dict: SectionDictInterface = {
    a: {
        slug: 'A',
        numStr: '1',
    },
    b: {
        slug: 'B',
        numStr: '2',
    },
    c: {
        slug: 'C',
        numStr: '3',
    },
    other: {
        slug: 'Other',
        numStr: '0',
    }
}



export const convertSectionNumStrToLetter = (value: string|null): string => {

    if (section_dict.a.numStr === value) {
        return section_dict.a.slug
    } else if (section_dict.b.numStr === value) {
        return section_dict.b.slug
    } else if (section_dict.c.numStr === value) {
        return section_dict.c.slug
    } else { 
        return section_dict.other.slug
    }

}

export const convertSectionLetterToNum = (value: string): string => {

    if (section_dict.a.slug === value) {
        return section_dict.a.numStr
    } else if (section_dict.b.slug === value) {
        return section_dict.b.numStr
    } else if (section_dict.c.slug === value) {
        return section_dict.c.numStr
    } else if (section_dict.other.slug === value) {
        return section_dict.other.numStr
    } else {
        return 'all'
    }

}