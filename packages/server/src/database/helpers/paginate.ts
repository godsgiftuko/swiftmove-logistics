import { NextFunction, Request, Response } from "express";
import { Document, Model, SortOrder } from "mongoose";

type PaginationRequest = {
  query: Record<string, string>;
} & Omit<Request, "query">;

type PaginationResponse = {
  paginatedResults: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
    items: any;
  };
} & Response;

export async function paginate<T extends Document>(model: Model<T>) {
  return async (
    req: PaginationRequest,
    res: PaginationResponse,
    next: NextFunction
  ) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter = req.query.status ? { status: req.query.status } : {};

    const sortField = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sortOrder === "desc" ? -1 : 1) as SortOrder;

    const sort: { [key: string]: SortOrder } = {};
    sort[sortField] = sortOrder;

    try {
      const results = await model
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec();

      const total = await model.countDocuments(filter);

      res.paginatedResults = {
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
