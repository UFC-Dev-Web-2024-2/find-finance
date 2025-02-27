import { FormGroup } from "@/components/form/form-group";
import { FormLabel } from "@/components/form/form-label";
import { LogoIcon } from "@/components/logo/logo-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router";
import * as z from "zod";

const CodeConfirmationSchema = z.object({
  code: z
    .string()
    .length(6, { message: "O código deve ter 6 caracteres" }),
});

type FormValidations = {
  code?: string;
};

export function EmailConfirmationPage() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [formValidations, setFormValidation] = useState<FormValidations>();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [email] = useState(() => localStorage.getItem("userEmail") || "");

  const isInvalidCode = Boolean(formValidations?.code);
  const isInvalidForm = !code;
  const isDisabledButtonSubmit = isInvalidForm || isSubmittingForm;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmittingForm(true);

    try {
      const formData = CodeConfirmationSchema.parse({ code });
      const response = await fetch(`http://localhost:3001/users?email=${email}`);
      const users = await response.json();

      if (users.length === 0) {
        throw new Error("Usuário não encontrado.");
      }

      const user = users[0];
      if (formData.code !== user.resetCode) {
        throw new Error("O código informado está incorreto ou expirado.");
      }

      navigate("/register/account-confirmation-status")
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFormValidation(error.flatten().fieldErrors);
      } else if (error instanceof Error) {
        setFormValidation({ code: error.message });
      }
    } finally {
      setIsSubmittingForm(false);
    }
  }

  return (
    <main className="flex flex-col items-center gap-8">
      <LogoIcon />
      <div className="space-y-2">
        <h1 className="text-center h1">Verifique sua identidade</h1>
        <p className="text-center text-slate-600 p-ui max-w-[60ch]">
          Um código de verificação de seis dígitos foi enviado para o e-mail <b>{email}</b>. Informe-o abaixo.
        </p>
      </div>
      <form className="w-[45%] space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <FormGroup>
            <FormLabel htmlFor="code">Código de verificação</FormLabel>
            <Input
              type="text"
              placeholder="8G5HB9"
              maxLength={6}
              value={code}
              onChange={({ target }) => setCode(target.value.toUpperCase())}
              className={`border ${isInvalidCode ? "border-red-500" : "border-gray-200"}`}
            />
            {isInvalidCode && (
              <span className="text-red-600 text-xs">
                {formValidations?.code}
              </span>
            )}
          </FormGroup>
        </div>
        <div className="space-y-3">
          <Button
            type="submit"
            className="w-full"
            disabled={isDisabledButtonSubmit}
          >
            {isSubmittingForm ? "Verificando código..." : "Verificar código"}
          </Button>
          <Button
            variant="link"
            className="w-full text-green-800"
            onClick={() => navigate("/")}
          >
            Voltar para login
          </Button>
        </div>
      </form>
    </main>
  );
}
