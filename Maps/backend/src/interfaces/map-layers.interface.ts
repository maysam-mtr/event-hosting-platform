export interface Layer { 
    id: string,
    name: string,
    data: number[],
    width: number,
    height: number,
    visible?: boolean
}

export interface Collision { 
    id: string,
    name: string,
    data: number[],
    width: number,
    height: number,
    visible?: boolean
}

export interface Booth {
    id: string,
    template?: string,
    x: number,
    y: number,
    width: number,
    height: number
}

export interface Spawn {
    id: string,
    name: string,
    x: number,
    y: number
}