"use client";

import { useEffect, useState, useTransition, useCallback } from "react";
import { Loader2, Trash2, ArchiveRestore, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { listRucs, deleteRuc, restoreRuc } from "@/app/actions/ruc";
import type { RucData } from "@/types/ruc";
import { PaginationControls } from "./pagination-controls";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { RucInfoCard } from "./ruc-info-card";

const RUC_PER_PAGE = 10;

export function RucList() {
  const [data, setData] = useState<RucData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleted, setShowDeleted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedRuc, setSelectedRuc] = useState<RucData | null>(null);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    const result = await listRucs();
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error al cargar la lista",
        description: result.error,
      });
      setData([]);
    } else {
      setData(result.data || []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAction = (ruc: string, action: 'delete' | 'restore') => {
    startTransition(async () => {
      const result = action === 'delete' ? await deleteRuc(ruc) : await restoreRuc(ruc);
      if (result.error) {
        toast({
          variant: "destructive",
          title: `Error al ${action === 'delete' ? 'borrar' : 'restaurar'}`,
          description: result.error,
        });
      } else {
        toast({
          title: "Éxito",
          description: `RUC ${action === 'delete' ? 'borrado' : 'restaurado'} correctamente.`,
        });
        await loadData();
      }
    });
  };

  const filteredData = data.filter((ruc) => (showDeleted ? ruc.isDelete : !ruc.isDelete));

  const totalPages = Math.ceil(filteredData.length / RUC_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * RUC_PER_PAGE,
    currentPage * RUC_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (currentPage === 0 && totalPages > 0) {
        setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-4 text-lg">Cargando RUCs guardados...</span>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center flex-wrap gap-4">
             <CardDescription>
                {showDeleted ? "Mostrando RUCs borrados lógicamente." : "Mostrando RUCs activos."}
              </CardDescription>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-deleted"
                checked={showDeleted}
                onCheckedChange={(checked) => {
                  setShowDeleted(checked);
                  setCurrentPage(1);
                }}
              />
              <Label htmlFor="show-deleted">Mostrar borrados</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">RUC</TableHead>
                  <TableHead className="font-bold">Razón Social</TableHead>
                  <TableHead className="font-bold">Estado</TableHead>
                  <TableHead className="font-bold">Condición</TableHead>
                  <TableHead className="font-bold text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((ruc) => (
                    <TableRow key={ruc.ruc} className={isPending ? "opacity-50" : ""}>
                      <TableCell className="font-mono">{ruc.ruc}</TableCell>
                      <TableCell>{ruc.razonSocial}</TableCell>
                      <TableCell>
                        <Badge variant={ruc.estado?.toLowerCase().includes("activo") ? "default" : "destructive"}>{ruc.estado}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={ruc.condicion?.toLowerCase().includes("habido") ? "default" : "destructive"}>{ruc.condicion}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedRuc(ruc)}>
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">Ver Detalles</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Ver Detalles</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          {showDeleted ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => handleAction(ruc.ruc, 'restore')} disabled={isPending}>
                                    <ArchiveRestore className="h-4 w-4" />
                                    <span className="sr-only">Restaurar</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Restaurar RUC</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => handleAction(ruc.ruc, 'delete')} disabled={isPending}>
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Borrar</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Borrar RUC</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No hay RUCs para mostrar.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </CardContent>
      </Card>

      {selectedRuc && (
        <Dialog open={!!selectedRuc} onOpenChange={(isOpen) => !isOpen && setSelectedRuc(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Detalles del RUC: {selectedRuc.ruc}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <RucInfoCard data={selectedRuc} />
                </div>
            </DialogContent>
        </Dialog>
      )}
    </>
  );
}
