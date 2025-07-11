"use server";

import type { RucData } from "@/types/ruc";

const API_BASE_URL = "https://ff77-179-6-1-44.ngrok-free.app/api/ruc";

export async function fetchRucData(ruc: string): Promise<{ data?: RucData; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/fetch/${ruc}`);

    if (!response.ok) {
      if (response.status === 404) {
        return { error: "No se encontró el RUC. Por favor, verifique el número." };
      }
      const errorData = await response.json().catch(() => null);
      return { error: errorData?.message || `Error del servidor: ${response.status}` };
    }

    const data: RucData = await response.json();
    return { data };
  } catch (error) {
    console.error("Failed to fetch RUC data:", error);
    return { error: "No se pudo conectar con el servicio de RUC. Intente más tarde." };
  }
}

export async function listRucs(): Promise<{ data?: RucData[]; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/list`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { error: errorData?.message || `Error del servidor: ${response.status}` };
    }

    const data: RucData[] = await response.json();
    return { data };
  } catch (error) {
    console.error("Failed to list RUCs:", error);
    return { error: "No se pudo conectar con el servicio para listar RUCs. Intente más tarde." };
  }
}

export async function deleteRuc(ruc: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/delete/${ruc}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isDelete: true }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { success: false, error: errorData?.message || `Error del servidor: ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to delete RUC:", error);
    return { success: false, error: "No se pudo conectar con el servicio para borrar el RUC. Intente más tarde." };
  }
}

export async function restoreRuc(ruc: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/restore/${ruc}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isDelete: false }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { success: false, error: errorData?.message || `Error del servidor: ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to restore RUC:", error);
    return { success: false, error: "No se pudo conectar con el servicio para restaurar el RUC. Intente más tarde." };
  }
}
