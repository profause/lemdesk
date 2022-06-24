export interface ServiceTicket {
  title?: string;
  description?: string;
  richTextDescription?: string;
  id?: string | undefined;
  initiator?: any;
  initiatorId?: any;
  assignedToDepartment?: any;
  assignedToResolver?: any;
  assignedToId?: any;
  status?: string;
  date?: string;
  category?: string;
  impact?: string;
  urgency?: string;
  attachments?: string[];
  type?: string;
  createdBy?: string;
  createdDate?: string;
  modifiedDate?: string;
}
