import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login - Co-Workers Cloud",
  description: "Inicia sesión en tu cuenta de Co-Workers Cloud. ¡Bienvenido de nuevo!",
};

export default function SignIn() {
  return <SignInForm />;
}
