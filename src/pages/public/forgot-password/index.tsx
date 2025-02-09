import { FormGroup } from "@/components/form/form-group";
import { FormLabel } from "@/components/form/form-label";
import { LogoIcon } from "@/components/logo/logo-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router";
import * as z from "zod";

const ForgotPasswordSchema = z.object({
  email: z.string().email()
});

type FormValidations = {
    email?: string;
};

export function ForgotPasswordPage() {
    const navigate = useNavigate();
    
    const [email, setEmail] = useState("");
    const [formValidations, setFormValidation] = useState<FormValidations>();
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);

    const isInvalidEmail = Boolean(formValidations?.email);
    const isInvalidForm = !email;
    const isDisabledButtonSubmit = isInvalidForm || isSubmittingForm;

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmittingForm(true);

        try {
            const formData = ForgotPasswordSchema.parse({email});
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (
                        formData.email === "admin@gmail.com"
                    ) {
                        return resolve(navigate("/forgot-password/code-confirmation"));
                    }

                    return reject(new Error("Não encontramos nenhuma conta associada a esse e-mail."));
                }, 1000);
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                setFormValidation(error.flatten().fieldErrors);
              } else if (error instanceof Error) {
                setFormValidation({ email: error.message });
            }
        } finally {
            setIsSubmittingForm(false);
        }
    }
    return (
        <main className="flex flex-col items-center gap-8">
            <LogoIcon />
            <div className="space-y-2">
                <h1 className="text-center h1">Esqueceu a sua senha senha?</h1>
                <p className="text-center text-slate-600 p-ui max-w-[60ch]">
                    Por favor informe o endereço de e-mail usado para acessar o sistema e nós iremos te enviar um código de verificação.
                </p>                
            </div>
            <form className="w-[45%] space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <FormGroup>
                        <FormLabel htmlFor="email">E-mail</FormLabel>
                        <Input
                            type="email"
                            placeholder="seuemail@exemplo.exemplo"
                            onChange={({ target }) => setEmail(target.value)}
                            className={`border ${isInvalidEmail ? "border-red-500" : "border-gray-200"}`}
                        />
                            {isInvalidEmail && (
                                <span className="text-red-600 text-xs">
                                    {formValidations?.email}
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
                        {isSubmittingForm ? "Acessando..." : "Confirmar email"}
                    </Button>
                    <Button
                        variant={"link"}
                        className="w-full text-green-800"
                        onClick={() => navigate("/")}
                    >
                        Voltar para login
                    </Button>                    
                </div>
            </form>
        </main>
    )
}