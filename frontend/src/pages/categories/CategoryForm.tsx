// Formulário de criar/editar categoria.

import React, { useState } from "react";
import { useCreateCategory } from "../../hooks/useCategories";
import { CategoryDot } from "../../components/ui/CategoryDot";
import { inputClass, labelClass, primaryButtonClass } from "../../lib/ui";

export function CategoryForm() {
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const createCategory = useCreateCategory();

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    createCategory.mutate({ name: name, color: color }, {
      onSuccess: () => {
        setName("");
        setColor("");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-5">
      <div>
        <label htmlFor="category-name" className={labelClass}>Nome</label>
        <input
          id="category-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex.: Mercado"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="category-color" className={labelClass}>Cor</label>
        <div className="mt-1.5 flex items-center gap-3">
          <input
            id="category-color"
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            className="h-9 w-12 cursor-pointer rounded-md border border-zinc-200 bg-white p-1"
          />
          <span className="flex items-center gap-2 text-xs text-zinc-500">
            <CategoryDot color={color || null} />
            <span className={color ? "font-mono uppercase" : undefined}>{color || "Sem cor (cinza)"}</span>
          </span>
        </div>
      </div>

      <button type="submit" className={primaryButtonClass}>
        {createCategory.isPending ? "Salvando…" : "Criar categoria"}
      </button>

      {createCategory.isError && (
        <p role="alert" className="text-xs text-zinc-600">
          Não foi possível criar a categoria. Verifique o nome e tente novamente.
        </p>
      )}
    </form>
  )
}
