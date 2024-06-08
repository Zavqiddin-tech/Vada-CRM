import { Request } from 'express';
export interface RequestWidthCompany extends Request {
  companyId: string;
}
