export interface RucData {
  ruc: string;
  razonSocial: string;
  nombreComercial: string | null;
  telefonos: string[];
  tipo: string | null;
  estado: string;
  condicion: string;
  direccion: string;
  departamento: string;
  provincia: string;
  distrito: string;
  fechaInscripcion: string | null;
  sistEmsion: string | null;
  sistContabilidad: string | null;
  actExterior: string | null;
  actEconomicas: string[];
  cpPago: string[];
  sistElectronica: string[];
  fechaEmisorFe: string | null;
  cpeElectronico: string[];
  fechaPle: string | null;
  padrones: string[];
  fechaBaja: string | null;
  profesion: string | null;
  ubigeo: string;
  capital: string | null;
  isDelete?: boolean;
}
