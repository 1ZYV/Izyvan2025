export type User = {
    id: string;
    name: string;
    email: string;
    roles: Role[];
} | null;

export type UserCredentials = {
    email: string;
    password: string;
};

export type Role = 'ADMIN' | 'AGENCY' | 'PROVIDER';

export type AuthResponse = {
    access_token: string;
    user: User;
    provider?: Provider;
};

export type Provider = {
    id: string;
    name: string;
    type: 'transport' | 'tourism'; // Tipo de proveedor, puede ser 'transport', 'tourism' o null si no es un proveedor
    contactInfo: {
        email: string;
        phone: string;
    };

    userId: string; // ID del usuario propietario del proveedor
}

export type CreateUserDto = {
    name: string;
    email: string;
    password: string;
}