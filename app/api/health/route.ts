import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'C4H Healthcare EMR',
      version: '1.0.0-demo'
    },
    { status: 200 }
  )
}