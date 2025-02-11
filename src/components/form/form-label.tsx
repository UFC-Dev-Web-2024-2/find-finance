type FormLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

export function FormLabel({ ...rest }: FormLabelProps) {
  return (
    <label
      className="block text-sm font-medium text-slate-800"
      {...rest}
    />
  )
}