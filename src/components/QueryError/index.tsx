type QueryErrorProps = {
  message?: string;
};

const QueryError = ({
  message = 'Não foi possível carregar os dados. Tente novamente.',
}: QueryErrorProps) => (
  <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
    {message}
  </p>
);

export default QueryError;
