import { NextFunction, Request, Response } from "express";
import { Document, Model, SortOrder } from "mongoose";

export function paginate<T extends Document>(model: Model<T>, options?: { populate?: string[] }) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const page = parseInt(req.query?.page as string ?? '1') || 1;
    const limit = parseInt(req.query?.limit as string ?? '10') || 10;
    const skip = (page - 1) * limit;
    
    const filter: any = {};

    if (req.query?.status) {
      filter['status'] = req.query.status;
    }

    if (req.query?.role) {
      filter['role'] = req.query.role;
    }
    
    const sortField = (req.query?.sortBy as string) || "createdAt";
    const sortOrder = ((req.query?.sortOrder === "desc") ? -1 : 1) as SortOrder;    

    const sort: { [key: string]: SortOrder } = {};
    sort[sortField] = sortOrder;

    try {
      const results = await model
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate(options?.populate || '')
        .exec();

      const total = await model.countDocuments(filter);

      (res as any).paginatedResults = {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        items: results,
      };

      next();
    } catch (err) {
      next(err);
    }
  };
}
