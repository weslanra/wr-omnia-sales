import { database } from "@/plugins/fake-api/handlers/points-of-sale/db";
import { paginateArray } from "@api-utils/paginateArray";
import is from "@sindresorhus/is";
import destr from "destr";
import type { PathParams } from "msw";
import { HttpResponse, http } from "msw";

export const handlerPointsOfSale = [
  // 👉 Points of sale
  // Get points of sale list
  http.get("/api/points-of-sale", ({ request }) => {
    const url = new URL(request.url);

    // Filters
    const q = url.searchParams.get("q");
    const page = url.searchParams.get("page");
    const itemsPerPage = url.searchParams.get("itemsPerPage");
    const sortBy = url.searchParams.get("sortBy");
    const orderBy = url.searchParams.get("orderBy");

    // Custom filters
    const active = url.searchParams.get("active");

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
    let filteredItems = database
      .filter(
        (it) =>
          (it.companyName.toLowerCase().includes(queryLowered) ||
            it.cnpj.toLowerCase().includes(queryLowered) ||
            it.companyName.toLowerCase().includes(queryLowered) ||
            it.fantasyName.toLowerCase().includes(queryLowered) ||
            it.contact.toString().includes(queryLowered) ||
            it.email.toString().includes(queryLowered) ||
            it.stateRegistration.toString().includes(queryLowered) ||
            it.municipalRegistration.toString().includes(queryLowered) ||
            it.address.city.name.toString().includes(queryLowered) ||
            it.address.state.name.toString().includes(queryLowered) ||
            it.address.state.abbreviation.toString().includes(queryLowered)) &&
          "" + it.active === (active || "" + it.active)
      )
      .reverse();

    // Sorting invoices
    if (sortByLocal) {
      // String sort
      if (
        sortByLocal === "companyName" ||
        sortByLocal === "fantasyName" ||
        sortByLocal === "email"
      ) {
        filteredItems = filteredItems.sort((a, b) => {
          if (orderByLocal === "asc")
            return a[sortByLocal].localeCompare(b[sortByLocal]);

          return b[sortByLocal].localeCompare(a[sortByLocal]);
        });
      }
    }

    const total = filteredItems.length;

    return HttpResponse.json(
      {
        data: paginateArray(filteredItems, itemsPerPageLocal, pageLocal),
        total,
      },
      {
        status: 200,
      }
    );
  }),

  // Get company
  http.get<PathParams>("/api/points-of-sale/:id", ({ params }) => {
    const id = params.id;

    const item = database.find((e) => e.id === Number(id));

    if (!item) {
      return HttpResponse.json("No point of sale found with this id", {
        status: 404,
      });
    }

    return HttpResponse.json(item, { status: 200 });
  }),
];
