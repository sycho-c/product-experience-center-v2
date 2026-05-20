import { useEffect, useState } from 'react';
import { useScenarioStore, selectCurrentStep } from '@/features/scenario-v2/store';
import { useAnchorContext } from './anchors/AnchorContext';
import { bezierPath } from '@/lib/anchor-math';

export function ConnectionCanvas() {
  const scenario = useScenarioStore((s) => s.scenario);
  const step = useScenarioStore(selectCurrentStep);
  const { anchors, stageRef } = useAnchorContext();
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const update = () => {
      const r = stage.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [stageRef]);

  if (!scenario) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-10"
      width={size.w}
      height={size.h}
      viewBox={`0 0 ${size.w || 1} ${size.h || 1}`}
      preserveAspectRatio="none"
    >
      {scenario.connections.map((conn) => {
        const from = anchors[conn.fromAnchorId];
        const to = anchors[conn.toAnchorId];
        if (!from || !to) return null;
        const isActive = step?.activeConnections.includes(conn.id) ?? false;
        const path = bezierPath(from, to);

        return (
          <g key={conn.id}>
            {/* Base line — idle: thin dashed, active: thicker solid */}
            <path
              d={path}
              fill="none"
              stroke={isActive ? '#A5B4FC' : '#CBD5E1'}
              strokeWidth={isActive ? 2.5 : 1.2}
              strokeDasharray={isActive ? undefined : '3 5'}
              strokeLinecap="round"
              opacity={isActive ? 1 : 0.7}
            />

            {/* Active flowing overlay — single dash stream */}
            {isActive && (
              <path
                d={path}
                fill="none"
                stroke="#4F46E5"
                strokeWidth={2.5}
                strokeDasharray="5 16"
                strokeLinecap="round"
                opacity={1}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to={conn.direction === 'in' ? '21' : '-21'}
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </path>
            )}

            {conn.label && (
              <text
                x={(from.x + to.x) / 2}
                y={(from.y + to.y) / 2 - 6}
                fill={isActive ? '#4F46E5' : '#94A3B8'}
                fontSize="10"
                fontWeight={isActive ? '600' : '500'}
                opacity={isActive ? 0.95 : 0.55}
                textAnchor="middle"
                className="font-sans"
              >
                {conn.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
