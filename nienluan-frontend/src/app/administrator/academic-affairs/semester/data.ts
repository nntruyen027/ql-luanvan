import {Semester} from "@/types/semester";

export const initialData: Semester[] = [
    {
        id: 1,
        name: 'Học kỳ 1 - 2023-2024',
        startDate: '2023-08-01',
        endDate: '2023-12-31',
        status: 'Inactive',
        year: {
            id: 2,
            name: '2023-2024',
            startDate: '2023-08-01',
            endDate: '2024-07-31',
            status: 'Inactive'
        }
    },
    {
        id: 2,
        name: 'Học kỳ 2 - 2023-2024',
        startDate: '2024-01-01',
        endDate: '2024-05-31',
        status: 'Inactive',
        year: {
            id: 2,
            name: '2023-2024',
            startDate: '2023-08-01',
            endDate: '2024-07-31',
            status: 'Inactive'
        }
    },
    {
        id: 3,
        name: 'Học kỳ hè - 2023-2024',
        startDate: '2024-06-01',
        endDate: '2024-07-31',
        status: 'Active',
        year: {
            id: 2,
            name: '2023-2024',
            startDate: '2023-08-01',
            endDate: '2024-07-31',
            status: 'Inactive'
        }
    }
];
