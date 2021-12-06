export interface ServiceTicketComment {
    text?: string;
    id?: string | undefined
    type?: string,
    serviceTicketId?: string,
    createdBy?: any,
    createdDate?: string,
    modifiedDate?: string,
}