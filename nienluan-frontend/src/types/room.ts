export interface Room {
    id: number;
    name: string;
    description?: string;
    status: 'Active' | 'Inactive';
}
