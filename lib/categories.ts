export type CategoryStyle = {
  abbr: string;
  text: string;
  bg: string;
  bar: string;
  ring: string;
};

const STYLES: Record<string, CategoryStyle> = {
  'วิทยาศาสตร์':    { abbr: 'วท', text: 'text-sci',    bg: 'bg-sci/15',    bar: 'bg-sci',    ring: 'border-sci' },
  'เทคโนโลยี':      { abbr: 'ทค', text: 'text-tech',   bg: 'bg-tech/15',   bar: 'bg-tech',   ring: 'border-tech' },
  'วิศวกรรม':       { abbr: 'วก', text: 'text-engr',   bg: 'bg-engr/15',   bar: 'bg-engr',   ring: 'border-engr' },
  'สิ่งแวดล้อม':    { abbr: 'สว', text: 'text-envi',   bg: 'bg-envi/15',   bar: 'bg-envi',   ring: 'border-envi' },
  'สังคม':          { abbr: 'สค', text: 'text-soci',   bg: 'bg-soci/15',   bar: 'bg-soci',   ring: 'border-soci' },
  'สุขภาพ':         { abbr: 'สข', text: 'text-health',  bg: 'bg-health/15', bar: 'bg-health',  ring: 'border-health' },
  'เกษตรและอาหาร':  { abbr: 'กอ', text: 'text-agri',   bg: 'bg-agri/15',   bar: 'bg-agri',   ring: 'border-agri' },
  'ศิลปะและสื่อ':   { abbr: 'ศส', text: 'text-arts',   bg: 'bg-arts/15',   bar: 'bg-arts',   ring: 'border-arts' },
};

const FALLBACK: CategoryStyle = {
  abbr: 'อื่น', text: 'text-brand-deep', bg: 'bg-brand-light', bar: 'bg-brand', ring: 'border-brand',
};

export function categoryStyle(name: string): CategoryStyle {
  return STYLES[name] ?? FALLBACK;
}

export const CATEGORY_ORDER = Object.keys(STYLES);
