"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { assignorApi } from "../services/assignor-api"
import type { CreateAssignorDto, UpdateAssignorDto } from "../types"

export function useAssignors() {
  return useQuery({
    queryKey: ["assignors"],
    queryFn: () => assignorApi.getAll(),
  })
}

export function useAssignor(id: string) {
  return useQuery({
    queryKey: ["assignors", id],
    queryFn: () => assignorApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateAssignor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateAssignorDto) =>
      assignorApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignors"] })
    },
  })
}

export function useUpdateAssignor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateAssignorDto
    }) => assignorApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["assignors"] })
      queryClient.invalidateQueries({
        queryKey: ["assignors", variables.id],
      })
    },
  })
}

export function useDeleteAssignor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => assignorApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignors"] })
    },
  })
}

