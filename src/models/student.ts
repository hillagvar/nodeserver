import { RowDataPacket } from "mysql2";

export interface Student extends RowDataPacket {
    id?: number;
    name: string;
    surname: string;
    gender?: string;
    phone?: string;
    birthday?: Date;
    email?: string;
}