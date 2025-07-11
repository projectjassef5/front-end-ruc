import { Building } from "lucide-react";

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto flex items-center h-16 px-4">
        <Building className="h-8 w-8 mr-3" />
        <h1 className="text-xl font-bold tracking-tight">
          Portal de Consulta RUC - Victor Cuaresma
        </h1>
      </div>
    </header>
  );
}
