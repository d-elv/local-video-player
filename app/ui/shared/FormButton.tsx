interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function FormButton({ children, ...attributes }: Props) {
  return (
    <button
      {...attributes}
      type="submit"
      className="rounded-lg bg-primary hover:bg-primary-foreground pl-4 pr-4 pt-1 pb-1 transition-colors"
    >
      {children}
    </button>
  );
}
