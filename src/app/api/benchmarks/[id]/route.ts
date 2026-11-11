import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/benchmarks/[id]
 * Returns a single benchmark with all its runs ordered newest-first.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    const bench = await db.benchmark.findUnique({
      where: { id },
      include: {
        runs: {
          orderBy: { createdAt: 'desc' },
          include: { environment: { select: { hostname: true } } },
        },
      },
    })

    if (!bench) {
      return NextResponse.json(
        { error: 'benchmark_not_found' },
        { status: 404 },
      )
    }

    return NextResponse.json({ data: bench })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      { error: 'failed_to_fetch_benchmark', details: message },
      { status: 500 },
    )
  }
}
