export interface Major {
    id: number;
    name: string;
    code: string;
    description?: string;
    status: 'Active' | 'Inactive';
}
