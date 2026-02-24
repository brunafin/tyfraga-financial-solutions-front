const Section = ({ title, children }: { title: string, children: React.ReactNode }) => {
  return (
    <section className="p-4">
      <h2 className="text-xl font-bold text-gray-700 mb-4">{title}</h2>
      {children}
    </section>
  )
}

export default Section