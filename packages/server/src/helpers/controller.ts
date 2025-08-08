/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';
import { HTTP_STATUS } from '../../../shared/constants';
import { ServiceResponse } from '../types/service';

type Status = 'success' | 'failed';

type ControllerResponseType = {
  status: Status;
  message: string;
  data: { [key: string]: any } | null;
};

export class ControllerResponse {
  constructor(
    private res: Response,
    private statusCode: number = HTTP_STATUS.OK,
    private status: Status = 'success'
  ) {}

  asJSON<D>(data?: ServiceResponse<D>, message: string = '') {
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
