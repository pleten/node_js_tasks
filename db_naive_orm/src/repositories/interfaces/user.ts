export interface IUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: 'admin' | 'moderator' | 'user';
    age?: number | null;
}