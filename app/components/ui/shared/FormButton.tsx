interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function FormButton({ children, ...attributes }: Props) {
  return (
    <button
      {...attributes}
      className="rounded-lg bg-background text-foreground pl-4 pr-4 h-10 transition-colors hover:bg-background-hover"
    >
      {children}
    </button>
  );
}
