import { paginateArray } from "@api-utils/paginateArray";
import { database } from "@db/users/db";
import is from "@sindresorhus/is";
import destr from "destr";
import type { PathParams } from "msw";
import { HttpResponse, http } from "msw";

export const handlerUsers = [
  // 👉 Users
  // Get users list
  http.get("/api/users", ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const profile = url.searchParams.get("profile");
    const pointSale = url.searchParams.get("pointSale");
    const active = url.searchParams.get("active");
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
    let usersFiltrados = database
      .filter(
        (it) =>
          (it.name.toLowerCase().includes(queryLowered) ||
            it.cpf.toLowerCase().includes(queryLowered) ||
            it.email.toString().includes(queryLowered) ||
            it.profile.toString().includes(queryLowered)) &&
          it.profile === (profile || it.profile) &&
          "" + it.pointSaleId === (pointSale || "" + it.pointSaleId) &&
          "" + it.active === (active || "" + it.active)
      )
      .reverse();

    // Sorting invoices
    if (sortByLocal) {
      // String sort
      if (
        sortByLocal === "name" ||
        sortByLocal === "email" ||
        sortByLocal === "profile"
      ) {
        usersFiltrados = usersFiltrados.sort((a, b) => {
          if (orderByLocal === "asc")
            return a[sortByLocal].localeCompare(b[sortByLocal]);

          return b[sortByLocal].localeCompare(a[sortByLocal]);
        });
      }
      // number sort
      else if (sortByLocal === "id") {
        usersFiltrados = usersFiltrados.sort((a, b) => {
          if (orderByLocal === "asc") return a[sortByLocal] - b[sortByLocal];

          return b[sortByLocal] - a[sortByLocal];
        });
      }
    }

    const total = usersFiltrados.length;

    return HttpResponse.json(
      {
        data: paginateArray(usersFiltrados, itemsPerPageLocal, pageLocal),
        total,
      },
      {
        status: 200,
      }
    );
  }),

  // Get user
  http.get<PathParams>("/api/users/:id", ({ params }) => {
    const id = params.id;

    const user = database.find((e) => e.id === Number(id));

    if (!user) {
      return HttpResponse.json("No user found with this id", {
        status: 404,
      });
    }

    return HttpResponse.json(user, { status: 200 });
  }),
];
