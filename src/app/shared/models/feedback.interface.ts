export interface Feedback {
  comment?: string;
  resolverId?: string;
  serviceTicketId?: string,
  initiatorId?: string;
  responseTime?: number;
  id?: string | undefined;
  satisfaction?: number;
  createdDate?: string;
  modifiedDate?: string;
}
