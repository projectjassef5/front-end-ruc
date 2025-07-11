import {
  Activity,
  ArrowRightLeft,
  Book,
  Briefcase,
  Building2,
  Calendar,
  CalendarCheck,
  CalendarClock,
  CalendarX,
  DollarSign,
  FileJson,
  FileText,
  GraduationCap,
  Info,
  Map,
  MapPin,
  Phone,
  BookUser,
  Receipt,
  Tag,
} from "lucide-react";
import type { RucData } from "@/types/ruc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

interface RucInfoCardProps {
  data: RucData;
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  className?: string;
}

const InfoItem = ({ icon, label, value, className }: InfoItemProps) => (
  <div className={cn("flex items-start space-x-4", className)}>
    <div className="flex-shrink-0 text-primary mt-1">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="text-base font-semibold break-words">{value || <span className="text-sm font-normal text-muted-foreground">No especificado</span>}</div>
    </div>
  </div>
);

const ListInfoItem = ({ icon, label, items }: { icon: React.ReactNode; label: string; items: string[] | undefined }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="col-span-1 md:col-span-2">
      <InfoItem icon={icon} label={label} value={
          <ul className="list-disc list-inside space-y-1">
              {items.map((item, i) => <li key={i} className="text-sm font-normal">{item}</li>)}
          </ul>
      }/>
    </div>
  )
};

const Section = ({ title, children, icon: Icon }: {title: string, children: React.ReactNode, icon: React.ElementType }) => (
    <div>
        <div className="flex items-center gap-2 mb-4">
            <Icon className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-primary">{title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pl-7">
            {children}
        </div>
    </div>
)

export function RucInfoCard({ data }: RucInfoCardProps) {
  const estadoVariant = data.estado?.toLowerCase().includes("activo") ? "default" : "destructive";
  const condicionVariant = data.condicion?.toLowerCase().includes("habido") ? "default" : "destructive";

  return (
    <Card className="w-full animate-in fade-in-50 duration-500 border-primary/20">
      <CardHeader className="bg-muted/30">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex-1">
                <CardTitle className="text-primary text-2xl">{data.razonSocial}</CardTitle>
                <CardDescription className="text-lg font-mono tracking-wider mt-1">{data.ruc}</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-2 flex-shrink-0">
                 <Badge variant={estadoVariant} className="capitalize text-sm py-1 px-3">{data.estado}</Badge>
                 <Badge variant={condicionVariant} className="capitalize text-sm py-1 px-3">{data.condicion}</Badge>
            </div>
        </div>
        {data.nombreComercial && 
            <InfoItem icon={<Briefcase className="h-5 w-5" />} label="Nombre Comercial" value={data.nombreComercial} className="pt-4" />
        }
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        <Section title="Ubicación y Contacto" icon={MapPin}>
            <InfoItem icon={<MapPin className="h-5 w-5" />} label="Dirección Completa" value={data.direccion} className="md:col-span-2" />
            <InfoItem icon={<Map className="h-5 w-5" />} label="Departamento" value={data.departamento} />
            <InfoItem icon={<Map className="h-5 w-5" />} label="Provincia" value={data.provincia} />
            <InfoItem icon={<Map className="h-5 w-5" />} label="Distrito" value={data.distrito} />
            <InfoItem icon={<Map className="h-5 w-5" />} label="Ubigeo" value={data.ubigeo} />
             {data.telefonos && data.telefonos.length > 0 && (
             <InfoItem icon={<Phone className="h-5 w-5" />} label="Teléfonos" value={data.telefonos.join(', ')} />
           )}
        </Section>
        
        <Separator />

        <Section title="Información General" icon={Info}>
            <InfoItem icon={<Tag className="h-5 w-5" />} label="Tipo de Contribuyente" value={data.tipo} />
            <InfoItem icon={<Calendar className="h-5 w-5" />} label="Fecha de Inscripción" value={data.fechaInscripcion} />
            <InfoItem icon={<CalendarX className="h-5 w-5" />} label="Fecha de Baja" value={data.fechaBaja} />
            <InfoItem icon={<GraduationCap className="h-5 w-5" />} label="Profesión u Oficio" value={data.profesion} />
            {data.capital && (
                <InfoItem icon={<DollarSign className="h-5 w-5" />} label="Capital" value={data.capital} />
            )}
        </Section>
        
        <Separator />

        <Section title="Sistemas y Actividades" icon={Activity}>
             <InfoItem icon={<Building2 className="h-5 w-5" />} label="Sistema de Emisión" value={data.sistEmsion} />
             <InfoItem icon={<Book className="h-5 w-5" />} label="Sistema de Contabilidad" value={data.sistContabilidad} />
             <InfoItem icon={<ArrowRightLeft className="h-5 w-5" />} label="Actividad de Comercio Exterior" value={data.actExterior} />
             <ListInfoItem icon={<Briefcase className="h-5 w-5" />} label="Actividades Económicas" items={data.actEconomicas} />
             <ListInfoItem icon={<BookUser className="h-5 w-5" />} label="Padrones" items={data.padrones} />
        </Section>

        <Separator />
        
        <Section title="Comprobantes Electrónicos" icon={FileText}>
            <InfoItem icon={<FileText className="h-5 w-5" />} label="Sistema de Emisión Electrónica" value={data.sistElectronica?.join(', ')} className="md:col-span-2"/>
            <InfoItem icon={<CalendarCheck className="h-5 w-5" />} label="Fecha Emisor FE" value={data.fechaEmisorFe} />
            <InfoItem icon={<CalendarClock className="h-5 w-5" />} label="Fecha PLE" value={data.fechaPle} />
            <ListInfoItem icon={<Receipt className="h-5 w-5" />} label="Comprobantes de Pago" items={data.cpPago} />
            <ListInfoItem icon={<FileJson className="h-5 w-5" />} label="CPE Electrónicos" items={data.cpeElectronico} />
        </Section>
      </CardContent>
    </Card>
  );
}
