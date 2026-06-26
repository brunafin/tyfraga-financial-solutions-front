import { useState } from "react";
import { Navigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import LogoFull from "../../assets/logo-full.png";
import Button from "../../components/ui/Button";
import { useAuth } from "../../contexts/Auth/useAuth";

const schema = z.object({
  password: z.string().min(1, "A senha é obrigatória"),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: FormData) => {
    setError(null);
    setIsSubmitting(true);

    try {
      await login(data.password);
    } catch {
      setError("Senha incorreta. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-light px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-8 flex justify-center">
          <img
            src={LogoFull}
            title="Logo Turtcoin"
            alt="Logo Turtcoin"
            className="h-16 w-auto"
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <label className="flex w-full flex-col gap-2">
            <span className="input-label">Senha</span>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Digite sua senha"
                className="input-field pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-text/50 transition-colors hover:text-text"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <span className="input-error">{errors.password.message}</span>
            )}
          </label>

          {error && <span className="input-error text-center">{error}</span>}

          <Button type="submit" size="full" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
