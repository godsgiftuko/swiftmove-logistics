/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Response } from 'express';
import { HTTP_STATUS } from '../../../shared/constants';
import { ServiceResponse } from '../types/service';
import createHttpError from 'http-errors';

type Status = 'success' | 'failed';

type ControllerResponseType = {
  status: Status;
  message: string;
  data: { [key: string]: any } | null;
};

export class ControllerResponse {
  constructor(
    private res: Response,
    private next: NextFunction,
    private statusCode: number = HTTP_STATUS.OK,
    private status: Status = 'success'
  ) {}

  asJSON<D>(data?: ServiceResponse<D>, message: string = '') {
    if (data?.[2] && data?.[2] >= HTTP_STATUS.BAD_REQUEST) {
      return this.next(createHttpError(data?.[2], data?.[1]!));
    }
    
    const response: Partial<ControllerResponseType> = {
      status: data?.[1] ? 'failed' : this.status,
      message: data?.[1] ?? message ?? '',
      data: data?.[1] ? null : data?.[0] ?? null,
    };
    return this.res.status(this.statusCode).json(response);
  }

  raw(data?: { [key: string]: any } | null) {
    return this.res.status(this.statusCode).json(data);
  }
}
