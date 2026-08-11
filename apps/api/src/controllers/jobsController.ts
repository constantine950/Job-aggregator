import type { Request, Response, NextFunction } from "express";
import { prisma } from "../db/client.js";
import type { WorkMode, EmploymentType } from "@job-aggregator/shared";

const VALID_WORK_MODES: WorkMode[] = ["onsite", "remote", "hybrid", "unknown"];
const VALID_EMPLOYMENT_TYPES: EmploymentType[] = [
  "full_time",
  "part_time",
  "contract",
  "internship",
  "nysc",
  "unknown",
];

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function buildWhereClause(query: Request["query"]) {
  const where: Record<string, unknown> = {
    expiredAt: null,
  };

  const state = typeof query.state === "string" ? query.state : undefined;
  if (state) where.state = state;

  const category =
    typeof query.category === "string" ? query.category : undefined;
  if (category) where.category = category;

  const workMode =
    typeof query.workMode === "string" ? query.workMode : undefined;
  if (workMode && VALID_WORK_MODES.includes(workMode as WorkMode)) {
    where.workMode = workMode;
  }

  const employmentType =
    typeof query.employmentType === "string" ? query.employmentType : undefined;
  if (
    employmentType &&
    VALID_EMPLOYMENT_TYPES.includes(employmentType as EmploymentType)
  ) {
    where.employmentType = employmentType;
  }

  const search =
    typeof query.search === "string" ? query.search.trim() : undefined;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { companyName: { contains: search, mode: "insensitive" } },
    ];
  }

  const postedWithinHours =
    typeof query.postedWithinHours === "string"
      ? Number(query.postedWithinHours)
      : undefined;
  if (
    postedWithinHours &&
    Number.isFinite(postedWithinHours) &&
    postedWithinHours > 0
  ) {
    where.firstSeenAt = {
      gte: new Date(Date.now() - postedWithinHours * 60 * 60 * 1000),
    };
  }

  return where;
}

function parsePagination(query: Request["query"]) {
  const rawPage = typeof query.page === "string" ? Number(query.page) : 1;
  const rawPageSize =
    typeof query.pageSize === "string"
      ? Number(query.pageSize)
      : DEFAULT_PAGE_SIZE;

  const page =
    Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const pageSize =
    Number.isFinite(rawPageSize) && rawPageSize > 0
      ? Math.min(Math.floor(rawPageSize), MAX_PAGE_SIZE)
      : DEFAULT_PAGE_SIZE;

  return { page, pageSize };
}

export async function listJobs(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const where = buildWhereClause(req.query);
    const { page, pageSize } = parsePagination(req.query);

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: { firstSeenAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.job.count({ where }),
    ]);

    res.json({
      jobs,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getJobById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.id },
    });

    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    res.json({ job });
  } catch (err) {
    next(err);
  }
}
