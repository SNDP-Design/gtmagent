'use client';
import React from 'react';

interface HeatmapCell {
  day: string;
  hour: number;
  count: number;
}

interface Props {
  cells: HeatmapCell[];
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = [6, 8, 10, 12, 14, 16, 18, 20, 22];

function getIntensityClass(count: number, max: number): string {
  if (count === 0) return 'bg-muted/30';
  const ratio = count / max;
  if (ratio < 0.2) return 'bg-primary/15';
  if (ratio < 0.4) return 'bg-primary/30';
  if (ratio < 0.6) return 'bg-primary/50';
  if (ratio < 0.8) return 'bg-primary/70';
  return 'bg-primary';
}

export default function ActionHeatmapInner({ cells }: Props) {
  const max = Math.max(...cells.map((c) => c.count), 1);

  const lookup: Record<string, number> = {};
  cells.forEach((c) => {
    lookup[`${c.day}-${c.hour}`] = c.count;
  });

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[480px]">
        {/* Hour labels */}
        <div className="flex items-center mb-1.5 pl-10">
          {HOURS.map((h) => (
            <div key={`h-${h}`} className="flex-1 text-center text-[10px] text-muted-foreground">
              {h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`}
            </div>
          ))}
        </div>

        {/* Grid rows */}
        {DAYS.map((day) => (
          <div key={day} className="flex items-center gap-0 mb-1">
            <span className="w-10 text-[11px] text-muted-foreground flex-shrink-0">{day}</span>
            {HOURS.map((hour) => {
              const count = lookup[`${day}-${hour}`] || 0;
              return (
                <div
                  key={`${day}-${hour}`}
                  className={`flex-1 h-7 mx-0.5 rounded-md transition-all duration-200 cursor-default group relative ${getIntensityClass(count, max)}`}
                  title={`${day} ${hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour - 12}pm`}: ${count} action${count !== 1 ? 's' : ''}`}
                >
                  {count > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[9px] font-bold text-white">{count}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Legend */}
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-[10px] text-muted-foreground">Less</span>
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((ratio, i) => (
            <div
              key={`legend-${i}`}
              className={`w-4 h-4 rounded-sm ${ratio === 0 ? 'bg-muted/30' : ''}`}
              style={ratio > 0 ? { backgroundColor: `rgba(124, 111, 255, ${ratio})` } : {}}
            />
          ))}
          <span className="text-[10px] text-muted-foreground">More</span>
        </div>
      </div>
    </div>
  );
}
