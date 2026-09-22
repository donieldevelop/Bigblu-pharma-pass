'use client';

export default function BarChartSVG({ data, color = '#D98E3B', height = 160 }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const barWidth = 100 / data.length;

  return (
    <div style={{ width: '100%' }}>
      <svg viewBox={'0 0 100 ' + height} preserveAspectRatio="none" style={{ width: '100%', height, display: 'block' }}>
        {data.map((d, i) => {
          const barHeight = (d.value / max) * (height - 20);
          const x = i * barWidth + barWidth * 0.2;
          const w = barWidth * 0.6;
          const y = height - 20 - barHeight;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={w}
              height={barHeight}
              rx="1.2"
              fill={color}
              opacity={i === data.length - 1 ? 1 : 0.55}
            />
          );
        })}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: '#8393A8', marginTop: 4 }}>
        <span>{data[0]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}
