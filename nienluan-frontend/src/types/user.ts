import { Major } from "./major";
import { PermissionGroup } from "./permission";

export type Student = {
    id: number;
    userCode?: string;
    name: string;
    userName: string;
    email: string;
    phoneNumber?: string,
    roles: PermissionGroup,
    email_verified_at?: string,
    remember_token?: string,
    major?: Major;
};

export type Teacher = {
    id: number;
    userCode?: string;
    name: string;
    userName: string;
    email: string;
    phoneNumber?: string,
    roles: PermissionGroup,
    avatar?: string,
    email_verified_at?: string,
    remember_token?: string,
    major?: Major;
};
