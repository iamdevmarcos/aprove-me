"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { payableApi } from "../services/payable-api"
import type { CreatePayableDto, UpdatePayableDto } from "../types"

export function usePayables() {
  return useQuery({
    queryKey: ["payables"],
    queryFn: () => payableApi.getAll(),
  })
}

export function usePayable(id: string) {
  return useQuery({
    queryKey: ["payables", id],
    queryFn: () => payableApi.getById(id),
    enabled: !!id,
  })
}

export function useCreatePayable() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePayableDto) => payableApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payables"] })
    },
  })
}

export function useUpdatePayable() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePayableDto }) =>
      payableApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payables"] })
      queryClient.invalidateQueries({
        queryKey: ["payables", variables.id],
      })
    },
  })
}

export function useDeletePayable() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => payableApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payables"] })
    },
  })
}

