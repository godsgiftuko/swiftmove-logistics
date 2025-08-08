import "express";

declare module "express" {
  export interface Response {
    paginatedResults?: {
      page: number;
      limit: number;
      totalPages: number;
      totalItems: number;
      items: any;
    };
  }
}
