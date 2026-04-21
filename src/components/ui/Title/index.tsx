const Title = ({ children }: { children: React.ReactNode }) => {
  return (
    <h1 className="text-xl text-primary/80 mb-4">{children}</h1>
  );
};

export default Title;