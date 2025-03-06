import { FormGroup } from "@/components/form/form-group";
import { FormLabel } from "@/components/form/form-label";
import { LogoIcon } from "@/components/logo/logo-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import * as z from "zod";

const CodeConfirmationSchema = z.object({
    code: z.string()
      .length(6, "O código deve ser composto por 6 caracteres.")
});

type FormValidations = {
    code?: string;
};

type fetchUserResponse = {
    id: number;
    email: string;
    resetCode: string;
}[];

export function CodeConfirmationPage() {
    const navigate = useNavigate();
    const { email } = useParams() as { email: string };
    
    const [code, setCode] = useState("");
    const [formValidations, setFormValidation] = useState<FormValidations>();
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);

    const isInvalidCode = Boolean(formValidations?.code);
    const isInvalidForm = !code;
    const isDisabledButtonSubmit = isInvalidForm || isSubmittingForm;

    const [resendTimer, setResendTimer] = useState(0);
    const [message, setMessage] = useState(
        <>
            Um código de verificação de seis dígitos foi enviado para o e-mail 
            <span className="text-slate-700 font-semibold"> {email}</span>, informe ele abaixo.         
        </>
    );

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmittingForm(true);
        
        try {
            const formData = CodeConfirmationSchema.parse({ code });
        
            const response = await fetch(`
                https://67c08efcb9d02a9f224a3ee1.mockapi.io/api/v3/users?email=${email}&resetCode=${formData.code}`,
            );

            if (!response.ok) {
                throw new Error("Erro ao buscar usuário.");
            }
        
            const users: fetchUserResponse = await response.json();
        
            if (users.length === 0 || users[0].resetCode !== formData.code) {
                throw new Error("Código incorreto ou expirado.");
            }
        
            navigate(`/forgot-password/create-new-password/${email}`);
        
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
    
    

    function handleResendCode() {
        if (resendTimer > 0) return;
        
        setResendTimer(60);
        
        setMessage(
            <>
                Reenviamos um código de verificação de seis dígitos para o e-mail  
                <span className="text-slate-700 font-semibold"> admin@gmail.com</span>, informe ele abaixo. 
                Caso continue sem receber o código, entre em contato. 
            </>
        );
    }
    
    return (
        <main className="flex flex-col items-center gap-8">
            <LogoIcon />
            <div className="space-y-2">
                <h1 className="text-center h1">Verifique sua identidade</h1>
                <p className="text-center text-slate-600 p-ui max-w-[60ch]">
                    {message}
                </p>                
            </div>
            <form className="w-[45%] space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <FormGroup>
                        <FormLabel htmlFor="code">Código de verificação</FormLabel>
                        <Input
                            type="text"
                            placeholder="Ex. 11111a"
                            onChange={({ target }) => setCode(target.value)}
                            className={`border ${isInvalidCode ? "border-red-500" : "border-gray-200"}`}
                            maxLength={6}
                        />
                            {isInvalidCode && (
                                <span className="text-red-600 text-xs">
                                    {formValidations?.code}
                                </span>
                            )}
                    </FormGroup>
                    <p className="text-slate-600 p-ui">
                        Ainda não recebeu o código? {resendTimer > 0 ? 
                            <span className="text-green-600">Aguarde {resendTimer} segundos para reenviar</span> 
                                : 
                            <span className="text-green-800 cursor-pointer hover:underline" onClick={handleResendCode}>Reenviar</span>
                        }
                    </p>
                </div>

                <div className="space-y-3">
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isDisabledButtonSubmit}
                    >
                        {isSubmittingForm ? "Acessando..." : "Verificar código"}
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