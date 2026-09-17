interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base =
    'rounded-full px-7 min-h-[48px] font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-primary text-white shadow-soft hover:shadow-lift hover:-translate-y-0.5',
    secondary: 'bg-secondary text-white shadow-soft hover:shadow-lift hover:-translate-y-0.5',
    outline: 'bg-white text-neutral-900 border border-neutral-200 hover:border-primary/40',
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
