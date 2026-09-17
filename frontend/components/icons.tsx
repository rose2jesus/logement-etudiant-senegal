interface IconProps {
  className?: string;
}

const base = 'currentColor';
const wrap = (path: React.ReactNode, className = 'h-5 w-5') => (
  <svg viewBox="0 0 24 24" fill="none" stroke={base} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    {path}
  </svg>
);

export const HeartIcon = ({ className }: IconProps) =>
  wrap(<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />, className);

export const HomeIcon = ({ className }: IconProps) =>
  wrap(<><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /></>, className);

export const ClockIcon = ({ className }: IconProps) =>
  wrap(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></>, className);

export const CheckCircleIcon = ({ className }: IconProps) =>
  wrap(<><circle cx="12" cy="12" r="9" /><path d="m8.5 12.5 2.5 2.5 5-5" /></>, className);

export const XCircleIcon = ({ className }: IconProps) =>
  wrap(<><circle cx="12" cy="12" r="9" /><path d="m9.5 9.5 5 5m0-5-5 5" /></>, className);

export const UsersIcon = ({ className }: IconProps) =>
  wrap(<><circle cx="9" cy="8" r="3.2" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0" /><path d="M16.5 8.5a3 3 0 1 1 0 6" /><path d="M15 14.2c2.7.3 4.8 2.4 5.5 5.3" /></>, className);

export const FlagIcon = ({ className }: IconProps) =>
  wrap(<><path d="M5 21V4" /><path d="M5 5h11l-2.2 3.5L16 12H5" /></>, className);

export const PlusCircleIcon = ({ className }: IconProps) =>
  wrap(<><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></>, className);

export const SearchIcon = ({ className }: IconProps) =>
  wrap(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>, className);

export const InboxIcon = ({ className }: IconProps) =>
  wrap(<><path d="M4 12h4l1.5 3h5L16 12h4" /><path d="M5 12 4 5h16l-1 7" /><path d="M4 12v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6" /></>, className);

export const SparklesIcon = ({ className }: IconProps) =>
  wrap(<><path d="M12 3v4M12 17v4M4 12h4M16 12h4" /><path d="M6.5 6.5 9 9M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5" /></>, className);

export const MapPinIcon = ({ className }: IconProps) =>
  wrap(<><path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.3" /></>, className);

export const WifiIcon = ({ className }: IconProps) =>
  wrap(<><path d="M2 8.5a15.5 15.5 0 0 1 20 0" /><path d="M5.5 12a10.5 10.5 0 0 1 13 0" /><path d="M9 15.5a5.5 5.5 0 0 1 6 0" /><circle cx="12" cy="19" r="1" fill={base} stroke="none" /></>, className);

export const DropletIcon = ({ className }: IconProps) =>
  wrap(<path d="M12 3s6.5 7 6.5 11.5a6.5 6.5 0 1 1-13 0C5.5 10 12 3 12 3Z" />, className);

export const BoltIcon = ({ className }: IconProps) =>
  wrap(<path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" />, className);

export const SnowflakeIcon = ({ className }: IconProps) =>
  wrap(<><path d="M12 2v20M4.5 6.5l15 11M19.5 6.5l-15 11" /></>, className);

export const UtensilsIcon = ({ className }: IconProps) =>
  wrap(<><path d="M7 3v7M5 3v5a2 2 0 0 0 4 0V3M9 3v18M17 3a3 3 0 0 0-3 3v6h6V6a3 3 0 0 0-3-3ZM17 12v9" /></>, className);

export const CarIcon = ({ className }: IconProps) =>
  wrap(<><path d="M4 16V11l2-5h12l2 5v5" /><rect x="2" y="16" width="20" height="4" rx="1" /><circle cx="7" cy="20" r="1.3" /><circle cx="17" cy="20" r="1.3" /></>, className);

export const ShieldIcon = ({ className }: IconProps) =>
  wrap(<path d="M12 3 5 6v6c0 4.5 3 7.7 7 9 4-1.3 7-4.5 7-9V6l-7-3Z" />, className);

export const BathIcon = ({ className }: IconProps) =>
  wrap(<><path d="M4 11V6a2 2 0 0 1 3.5-1.3" /><path d="M3 11h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-3Z" /><path d="M7 19v2M17 19v2" /></>, className);
