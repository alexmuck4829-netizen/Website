'use client';

import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { formatPrice } from '@/lib/utils';

export function RevenueChart({
  data,
}: {
  data: { date: string; revenue: number; orders: number }[];
}) {
  return (
    <div className="surface-card p-5">
      <div className="mb-5 space-y-1">
        <h2 className="font-display text-lg font-medium text-ink">Chiffre d’affaires</h2>
        <p className="text-sm text-ink-muted">14 derniers jours</p>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(124 92 255)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="rgb(124 92 255)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="rgb(38 38 50)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(value: string) => value.slice(5).replace('-', '/')}
              tick={{ fill: 'rgb(113 113 133)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: 'rgb(113 113 133)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={56}
              tickFormatter={(value: number) => `€${value}`}
            />
            <Tooltip
              cursor={{ stroke: 'rgb(124 92 255)', strokeOpacity: 0.3 }}
              contentStyle={{
                background: 'rgb(29 29 40)',
                border: '1px solid rgb(55 55 71)',
                borderRadius: 12,
                fontSize: 13,
              }}
              labelStyle={{ color: 'rgb(156 156 176)' }}
              formatter={(value: number, name: string) => [
                name === 'revenue' ? formatPrice(value) : value,
                name === 'revenue' ? 'Chiffre d’affaires' : 'Commandes',
              ]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="rgb(124 92 255)"
              strokeWidth={2}
              fill="url(#revenueFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
