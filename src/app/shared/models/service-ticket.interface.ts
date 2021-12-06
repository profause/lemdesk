export interface ServiceTicket {
    title?: string;
    description?: string;
    id?: string | undefined
    initiator?: any;
    assignedTo?: any
    status?: string
    date?: string
    category?: string
    impact?: string
    urgency?: string
    attachments?: string[],
    type?: string,
    createdBy?: string,
    createdDate?: string,
    modifiedDate?: string,
}