import { ExecuteResult } from './../../core/mysql/src/connection.ts';

export interface ServiceResult {
  success: boolean;
  data?: ExecuteResult|{[key: string]: string|null|number}|null,
  message?: string|null,
  code?: string,
}