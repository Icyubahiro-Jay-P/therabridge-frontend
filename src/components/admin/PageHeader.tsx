export function PageHeader({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  )
}
