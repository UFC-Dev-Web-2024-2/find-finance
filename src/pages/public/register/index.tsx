import { useState } from "react";
import { FormGroup } from "@/components/form/form-group";
import { FormLabel } from "@/components/form/form-label";
import { LogoIcon } from "@/components/logo/logo-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import z from "zod";
import { useNavigate } from "react-router";

const RegisterSchema = z
  .object({
    username: z.string().min(3, { message: "O nome de usuário deve ter pelo menos 3 caracteres" }),
    fullName: z.string().min(3, { message: "O nome completo deve ter pelo menos 3 caracteres" }),
    email: z.string().email({ message: "Digite um e-mail válido" }),
    password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type FormValidations = {
  username?: string;
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formValidations, setFormValidations] = useState<FormValidations>();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const isInvalidForm = !username || !fullName || !email || !password || !confirmPassword;
  const isDisabledButtonSubmit = isInvalidForm || isSubmittingForm;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmittingForm(true);
  
    try {
      const resetCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const formData = RegisterSchema.parse({ username, fullName, email, password, confirmPassword });

      const response = await fetch("https://67c08efcb9d02a9f224a3ee1.mockapi.io/api/v3/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          resetCode,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao registrar nova conta.");
      }

      localStorage.setItem("userEmail", formData.email);
      navigate(`/register/email-confirmation/${resetCode}`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFormValidations(error.flatten().fieldErrors);
      } else {
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert("Ocorreu um erro desconhecido.");
        }
      }
    } finally {
      setIsSubmittingForm(false);
    }
  }
  

  return (
    <>
      <div className="flex justify-center">
        <div className="space-y-8 w-[55%]">
          <LogoIcon />

          <div className="space-y-2">
            <h1 className="h1 max-w-[25ch]">
              Simplifique o controle das suas finanças com o FindFinace.
            </h1>
            <p className="p-ui text-slate-600 max-w-[50ch]">
              Acesse seu painel e transforme a maneira como você gerencia seu dinheiro. Seguro, rápido e eficiente.
            </p>
          </div>
        </div>

        <form className="w-[45%] space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <FormGroup>
              <FormLabel htmlFor="username">Nome de Usuário</FormLabel>
              <Input
                id="username"
                type="text"
                placeholder="Como você quer ser chamado"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
              {formValidations?.username && (
                <span className="text-red-600 text-xs">{formValidations.username}</span>
              )}
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="fullName">Nome Completo</FormLabel>
              <Input
                id="fullName"
                type="text"
                placeholder="Seu nome completo"
                value={fullName}
                onChange={({ target }) => setFullName(target.value)}
              />
              {formValidations?.fullName && (
                <span className="text-red-600 text-xs">{formValidations.fullName}</span>
              )}
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="email">E-mail</FormLabel>
              <Input
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={({ target }) => setEmail(target.value)}
              />
              {formValidations?.email && (
                <span className="text-red-600 text-xs">{formValidations.email}</span>
              )}
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="password">Senha</FormLabel>
              <Input
                id="password"
                type="password"
                placeholder="Senha"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
              {formValidations?.password && (
                <span className="text-red-600 text-xs">{formValidations.password}</span>
              )}
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="confirmPassword">Confirmar Senha</FormLabel>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={({ target }) => setConfirmPassword(target.value)}
              />
              {formValidations?.confirmPassword && (
                <span className="text-red-600 text-xs">{formValidations.confirmPassword}</span>
              )}
            </FormGroup>
          </div>

          <Button type="submit" className="w-full" disabled={isDisabledButtonSubmit}>
            {isSubmittingForm ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>
      </div>

      <img
        src="./src/assets/login.svg"
        className="fixed left-1/2 w-[1160px] -translate-x-1/2 translate-y-1/4"
        alt="Ilustração de login"
      />
    </>
  );
}
