// Cartoon infographic SVG icons สำหรับแต่ละหมวดหมู่วิชา
// stroke="white" บน colored background — ง่ายต่อการจดจำ

type Props = { name: string; className?: string };

export function CategoryIcon({ name, className = 'h-8 w-8' }: Props) {
  const shared = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'white',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': true,
  };

  switch (name) {
    case 'วิทยาศาสตร์':
      // Flask with bubbles — recognizable = science
      return (
        <svg {...shared}>
          <path d="M9 3h6" />
          <path d="M10 3v6L6 16a2 2 0 001.8 3h8.4A2 2 0 0018 16l-4-7V3" />
          <circle cx="10.5" cy="15" r="0.9" fill="white" stroke="none" />
          <circle cx="14" cy="13" r="0.6" fill="white" stroke="none" />
        </svg>
      );

    case 'เทคโนโลยี':
      // Monitor + keyboard lines — tech
      return (
        <svg {...shared}>
          <rect x="2" y="3" width="20" height="13" rx="2" />
          <path d="M8 21h8M12 16v5" />
          <path d="M7 9h10M7 13h6" />
        </svg>
      );

    case 'วิศวกรรม':
      // Gear/cog — engineering
      return (
        <svg {...shared} strokeWidth={1.8}>
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 1.5v3M12 19.5v3M3.4 5.3l2.1 2.1M18.5 18.5l2.1 2.1M1.5 12h3M19.5 12h3M3.4 18.7l2.1-2.1M18.5 5.5l2.1-2.1" />
        </svg>
      );

    case 'สิ่งแวดล้อม':
      // Leaf with stem — environment
      return (
        <svg {...shared}>
          <path d="M17 8C8 10 5.9 16.17 3.82 19.17a2.5 2.5 0 003.36 3.43C10.17 20.5 17 19 17 8z" />
          <path d="M17 8c1.5 2.5 2 5 1.5 8M5 18l4-4" />
        </svg>
      );

    case 'สังคม':
      // Two people — social/community
      return (
        <svg {...shared}>
          <circle cx="9" cy="7" r="3" />
          <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
          <path d="M16 3.13a4 4 0 010 7.75" />
          <path d="M21 21v-2a4 4 0 00-3-3.87" />
        </svg>
      );

    case 'สุขภาพ':
      // Heart + cross — health/medicine
      return (
        <svg {...shared}>
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7z" />
          <path d="M12 5v6M9 8h6" />
        </svg>
      );

    case 'เกษตรและอาหาร':
      // Plant sprout — agriculture
      return (
        <svg {...shared}>
          <path d="M12 22V11" />
          <path d="M12 11C12 8 15 4.5 20 4c0 4.5-2 8.5-8 7" />
          <path d="M12 11C12 8 9 4.5 4 4c0 4.5 2 8.5 8 7" />
          <path d="M5 22h14" />
        </svg>
      );

    case 'ศิลปะและสื่อ':
      // Paintbrush — arts & media
      return (
        <svg {...shared}>
          <path d="M20.71 3.29a1 1 0 00-1.42 0l-8.38 8.38a2 2 0 00-.55 1.06l-.5 2.5 2.5-.5a2 2 0 001.06-.55l8.38-8.38a1 1 0 000-1.42z" />
          <path d="M4.5 22c1.5-1.5 2.5-3 1.5-5C4.5 17.5 3 19 4.5 22z" />
          <path d="M12 6l4 4" />
        </svg>
      );

    default:
      // Generic star fallback
      return (
        <svg {...shared}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
  }
}
