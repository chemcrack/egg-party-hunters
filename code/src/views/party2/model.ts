export interface rowData {
    ext: string;
    id: string;
    doorMain: {
        sort: string;
        degree: number;
        groupId: number;
    },
    doorSide: {
        sort: string;
        degree: number;
        groupId: number;
    },
    date: string
}