import { Student } from "@/types/user";

interface ApiStudent {
    id: number;
    user_code: string;
    name: string;
    username: string;
    email: string;
    phone_number: string;
    roles: {
        id: number;
        name: string
    };
    email_verified_at: string;
    remember_token: string;
    major: {
        id: number;
        name: string;
        code: string;
        description: string;
        is_active: boolean
    }
}

export function mapStudent(data: ApiStudent): Student {
    return {
        id: data.id,
        userCode: data.user_code,
        name: data.name,
        userName: data.username,
        email: data.email,
        phoneNumber: data.phone_number,
        roles: {
            id: data.roles?.[0].id,
            name: data.roles?.[0].name
        },
        email_verified_at: data.email_verified_at,
        remember_token: data.remember_token,
        major: {
            id: data.major.id,
            name: data.major.name,
            code: data.major.code,
            description: data.major.description,
            status: data.major.is_active ? "Active" : "Inactive",
        }
    }
}