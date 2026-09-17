interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, id, ...props }: InputProps) {
  const inputId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-neutral-900">
        {label}
      </label>
      <input
        id={inputId}
        className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-base transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
        {...props}
      />
    </div>
  );
}
