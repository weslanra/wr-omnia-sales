import { database } from "@/plugins/fake-api/handlers/clients/db";
import { paginateArray } from "@api-utils/paginateArray";
import is from "@sindresorhus/is";
import destr from "destr";
import type { PathParams } from "msw";
import { HttpResponse, http } from "msw";

export const handlerCliente = [
  // 👉 Clientes
  // Get lista de clientes
  http.get("/api/clientes", ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const tipo = url.searchParams.get("tipo");
    const adimplente = url.searchParams.get("adimplente");
    const page = url.searchParams.get("page");
    const itemsPerPage = url.searchParams.get("itemsPerPage");
    const sortBy = url.searchParams.get("sortBy");
    const orderBy = url.searchParams.get("orderBy");

    const searchQuery = is.string(q) ? q : undefined;
    const queryLowered = (searchQuery ?? "").toString().toLowerCase();

    const parsedSortBy = destr(sortBy);
    const sortByLocal = is.string(parsedSortBy) ? parsedSortBy : "";

    const parsedOrderBy = destr(orderBy);
    const orderByLocal = is.string(parsedOrderBy) ? parsedOrderBy : "";

    const parsedItemsPerPage = destr(itemsPerPage);
    const parsedPage = destr(page);

    const itemsPerPageLocal = is.number(parsedItemsPerPage)
      ? parsedItemsPerPage
      : 10;
    const pageLocal = is.number(parsedPage) ? parsedPage : 1;

    // Filtering invoices
    let clientesFiltrados = database
      .filter(
        (cliente) =>
          (cliente.nome.toLowerCase().includes(queryLowered) ||
            cliente.telefone.toLowerCase().includes(queryLowered) ||
            cliente.codigo.toString().includes(queryLowered) ||
            cliente.id.toString().includes(queryLowered)) &&
          cliente.tipo === (tipo || cliente.tipo) &&
          "" + cliente.adimplente === (adimplente || "" + cliente.adimplente)
      )
      .reverse();

    // Sorting invoices
    if (sortByLocal) {
      // String sort
      if (
        sortByLocal === "nome" ||
        sortByLocal === "codigo" ||
        sortByLocal === "municipioNome" ||
        sortByLocal === "uf" ||
        sortByLocal === "telefone" ||
        sortByLocal === "tipo"
      ) {
        clientesFiltrados = clientesFiltrados.sort((a, b) => {
          if (orderByLocal === "asc")
            return a[sortByLocal].localeCompare(b[sortByLocal]);

          return b[sortByLocal].localeCompare(a[sortByLocal]);
        });
      }
      // number sort
      else if (sortByLocal === "id") {
        clientesFiltrados = clientesFiltrados.sort((a, b) => {
          if (orderByLocal === "asc") return a[sortByLocal] - b[sortByLocal];

          return b[sortByLocal] - a[sortByLocal];
        });
      }
    }

    const totalClientes = clientesFiltrados.length;

    return HttpResponse.json(
      {
        clientes: paginateArray(
          clientesFiltrados,
          itemsPerPageLocal,
          pageLocal
        ),
        totalClientes,
      },
      {
        status: 200,
      }
    );
  }),

  // Get cliente
  http.get<PathParams>("/api/clientes/:id", ({ params }) => {
    const clienteId = params.id;

    const cliente = database.find((e) => e.id === Number(clienteId));

    if (!cliente) {
      return HttpResponse.json("Nenhum cliente encontrado com este id", {
        status: 404,
      });
    }

    return HttpResponse.json(cliente, { status: 200 });
  }),

  // Delete cliente
  http.delete("/api/clientes/:id", ({ params }) => {
    const clienteId = params.id;

    const clienteIndex = database.findIndex((e) => e.id === Number(clienteId));

    if (clienteIndex >= 0) {
      database.splice(clienteIndex, 1);

      return new HttpResponse(null, {
        status: 204,
      });
    }

    return HttpResponse.json({ error: "Algo deu errado" }, { status: 404 });
  }),
];
