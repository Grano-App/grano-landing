import { cn } from "@/lib/cn";

const control = "h-14 w-full rounded-input border bg-white px-5 text-base text-navy-900 placeholder:text-gray-400";

function Label({ htmlFor, label, required }: { htmlFor: string; label: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-bold text-navy-900">
      {label}
      {required && <span className="text-danger" aria-hidden="true"> *</span>}
    </label>
  );
}

type TextFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "name"> & {
  id: string;
  label: string;
  error?: string;
};

/** Текстове поле з підписом і помилкою під ним (`aria-invalid`, `aria-describedby`). */
export function TextField({ id, label, error, required, className, ...rest }: TextFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id} label={label} required={required} />
      <input
        id={id}
        name={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(control, error ? "border-danger" : "border-gray-200 focus:border-green-700")}
        {...rest}
      />
      {error && <p id={`${id}-error`} className="text-sm text-danger">{error}</p>}
    </div>
  );
}

type SelectFieldProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "id" | "name"> & {
  id: string;
  label: string;
  placeholder: string;
  options: readonly string[];
};

/** Випадний список з підписом; перший пункт — неактивна підказка. */
export function SelectField({ id, label, placeholder, options, className, ...rest }: SelectFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id} label={label} />
      <select id={id} name={id} defaultValue="" className={cn(control, "border-gray-200")} {...rest}>
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
