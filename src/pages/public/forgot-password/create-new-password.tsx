import { FormGroup } from "@/components/form/form-group";
import { FormLabel } from "@/components/form/form-label";
import { LogoIcon } from "@/components/logo/logo-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router";
import * as z from "zod";

import { Eye, EyeOff } from "lucide-react";

const ForgotPasswordSchema = z.object({
    password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
    confirmPassword: z.string().min(6, { message: "" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas devem ser iguais",
    path: ["confirmPassword"],
});

type FormValidations = {
    password?: string;
    confirmPassword?: string;
};

type fetchUserResponse = {
    id: number;
    email: string;
    resetCode: string;
}[];

export function CreateNewPasswordPage() {
    const navigate = useNavigate();
    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formValidations, setFormValidation] = useState<FormValidations>();
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const isInvalidPassword = Boolean(formValidations?.password);
    const isInvalidConfirmPassword = Boolean(formValidations?.confirmPassword);
    const isInvalidForm = !password || !confirmPassword;
    const isDisabledButtonSubmit = isInvalidForm || isSubmittingForm;

    function togglePasswordVisibility() {
        setShowPassword((prev) => !prev);
    }

    function toggleConfirmPasswordVisibility() {
        setShowConfirmPassword((prev) => !prev);
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmittingForm(true);
    
        try {
            const formData = ForgotPasswordSchema.parse({ password, confirmPassword });
    
            const response = await fetch("http://localhost:3001/users?email=admin@gmail.com");
            const users: fetchUserResponse = await response.json();
    
            if (users.length > 0) {
                const user = users[0];
                await fetch(`http://localhost:3001/users/${user.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ password: formData.password }),
                });
    
                await new Promise((resolve) => {
                    setTimeout(() => {
                        return resolve(navigate("/"));
                    }, 1000);
                });
            } else {
                throw new Error("Usuário não encontrado");
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                setFormValidation(error.flatten().fieldErrors);
            } else if (error instanceof Error) {
                setFormValidation({ password: error.message });
            }
        } finally {
            setIsSubmittingForm(false);
        }
    }

    return (
        <main className="flex flex-col items-center gap-8">
            <LogoIcon />
            <div className="space-y-2">
                <h1 className="text-center h1">Criar uma nova senha</h1>
                <p className="text-center text-slate-600 p-ui max-w-[60ch]">
                    Informe abaixo a sua nova senha. Após a conclusão, ela será utilizada para acessar o sistema.
                </p>                
            </div>
            <form className="w-[45%] space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <FormGroup>
                        <FormLabel htmlFor="password">Nova senha</FormLabel>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Senha"
                                className={`w-full pr-10 ${isInvalidPassword ? "border-red-600" : ""}`}
                                onChange={({ target }) => setPassword(target.value)}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-2 flex items-center"
                            >
                                {!showPassword ? <EyeOff className="text-slate-500 w-5 h-5" /> : <Eye className="text-slate-500 w-5 h-5" />}
                            </button>
                        </div>
                        {isInvalidPassword && (
                            <span className="text-red-600 text-xs">{formValidations?.password}</span>
                        )}
                    </FormGroup>

                    <FormGroup>
                        <FormLabel htmlFor="confirmPassword">Confirmar senha</FormLabel>
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirmar senha"
                                className={`w-full pr-10 ${isInvalidConfirmPassword ? "border-red-600" : ""}`}
                                onChange={({ target }) => setConfirmPassword(target.value)}
                            />
                            <button
                                type="button"
                                onClick={toggleConfirmPasswordVisibility}
                                className="absolute inset-y-0 right-2 flex items-center"
                            >
                                {!showConfirmPassword ? <EyeOff className="text-slate-500 w-5 h-5" /> : <Eye className="text-slate-500 w-5 h-5" />}
                            </button>
                        </div>
                        {isInvalidConfirmPassword && (
                            <span className="text-red-600 text-xs">{formValidations?.confirmPassword}</span>
                        )}
                    </FormGroup>
                </div>

                <div className="space-y-3">
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isDisabledButtonSubmit}
                    >
                        {isSubmittingForm ? "Enviando nova senha..." : "Resetar senha"}
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