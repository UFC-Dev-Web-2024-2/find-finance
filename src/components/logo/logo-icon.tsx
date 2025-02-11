type LogoIconProps = React.SVGProps<SVGSVGElement>

export function LogoIcon(props: LogoIconProps) {
  return (
    <svg
      width={48}
      height={32}
      viewBox="0 0 48 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx={15.0588} cy={16} r={15.0588} fill="#86EFAC" />
      <circle
        cx={32.9411}
        cy={16}
        r={15.0588}
        fill="url(#paint0_linear_148_418)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_148_418"
          x1={21.4286}
          y1={6.57139}
          x2={42.8572}
          y2={24.5714}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#22C55E" />
          <stop offset={1} stopColor="#03A33E" />
        </linearGradient>
      </defs>
    </svg>
  )
}

