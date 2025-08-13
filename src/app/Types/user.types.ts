import { TypeProvider } from "@angular/core";

export interface User {
    id: number;
    email: string;
    name: string;
    roles: Role[];
    tel?: string;
    NIT?: string;
    address?: string;
}

export type Role = 'ADMIN' | 'PROVIDER' | 'AGENCY';

