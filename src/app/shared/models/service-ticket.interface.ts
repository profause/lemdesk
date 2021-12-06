export interface ServiceTicket {
    title?: string;
    description?: string;
    id?: string | undefined
    initiator?: string
    assignedTo?: any
    status?: string
    date?: string
    category?: string
    impact?: string
    urgency?: string
    attachments?: string[],
    type?: string,
    createdDate?: string,
    modifiedDate?: string,
}