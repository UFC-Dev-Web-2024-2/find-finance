import { useState } from "react";

import { FormGroup } from "@/components/form/form-group";
import { FormLabel } from "@/components/form/form-label";
import { LogoIcon } from "@/components/logo/logo-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import z from "zod";
import { Link, useNavigate } from "react-router";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
});

type FormValidations = {
  email?: string;
  password?: string;
};

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formValidations, setFormValidation] = useState<FormValidations>();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const isInvalidForm = !email || !password;
  const isDisabledButtonSubmit = isInvalidForm || isSubmittingForm;

  const isInvalidEmail = Boolean(formValidations?.email);
  const isInvalidPassword = Boolean(formValidations?.password);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmittingForm(true);

    try {
      const formData = LoginSchema.parse({ email, password });
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (
            formData.email === "admin@gmail.com" &&
            formData.password === "123456"
          ) {
            return resolve(navigate("/dashboard"));
          }

          return reject(alert("E-mail ou senha inválidos. Tente novamente."));
        }, 1000);
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFormValidation(error.flatten().fieldErrors);
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
              Acesse seu painel e transforme a maneira como você gerencia seu
              dinheiro. Seguro, rápido e eficiente.
            </p>
          </div>
        </div>

        <form className="w-[45%] space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <FormGroup>
              <FormLabel htmlFor="email">E-mail</FormLabel>
              <Input
                type="email"
                placeholder="seuemail@exemplo.exemplo"
                onChange={({ target }) => setEmail(target.value)}
              />
              {isInvalidEmail && (
                <span className="text-red-600 text-xs">
                  {formValidations?.email}
                </span>
              )}
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="password">Senha</FormLabel>
              <Input
                type="password"
                placeholder="Senha"
                className={isInvalidPassword ? "border-red-600" : ""}
                onChange={({ target }) => setPassword(target.value)}
              />
              <Link
                to="/forgot-password"
                className="body-medium block text-green-800 hover:underline"
              >
                Esqueceu sua senha?
              </Link>
              {isInvalidPassword && (
                <span className="text-red-600 text-xs">
                  {formValidations?.password}
                </span>
              )}
            </FormGroup>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isDisabledButtonSubmit}
          >
            {isSubmittingForm ? "Acessando..." : "Acessar Painel"}
          </Button>
        </form>
      </div>

      <img
        src="./src/assets/login.svg"
        className="fixed left-1/2 w-[1160px] -translate-x-1/2 translate-y-1/4"
      />
    </>
  );
}
