import { ExecuteResult } from './../../core/mysql/src/connection.ts';

export interface ServiceResult {
  success: boolean;
  data?: ExecuteResult|null,
  message?: string|null,
  code?: string,
}