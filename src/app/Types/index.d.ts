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

export type Role = 'admin' | 'agency' | 'provider';

export type AuthResponse = {
    token: string;
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