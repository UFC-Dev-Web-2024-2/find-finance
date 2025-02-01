type FormGroupProps = React.HTMLAttributes<HTMLDivElement>

export function FormGroup({ children, ...rest }: FormGroupProps) {
  return (
    <div className="space-y-1" {...rest}>
      {children}
    </div>
  )
}