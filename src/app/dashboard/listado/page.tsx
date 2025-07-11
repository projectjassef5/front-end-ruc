import { RucList } from "@/components/ruc-list";

export default function ListadoPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Listado de RUCs Guardados
      </h1>
      <RucList />
    </div>
  );
}
