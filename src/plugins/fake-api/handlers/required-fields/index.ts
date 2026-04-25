import {
  databaseClient,
  databaseProduct,
} from "@/plugins/fake-api/handlers/required-fields/db";
import { paginateArray } from "@api-utils/paginateArray";
import is from "@sindresorhus/is";
import destr from "destr";
import type { PathParams } from "msw";
import { HttpResponse, http } from "msw";

export const handlerRequiredFields = [
  // 👉 Points of sale
  // Get points of sale list
  http.get("/api/required-fields/:type", ({ request, params }) => {
    const type = params.type;
    const url = new URL(request.url);

    if (type !== "client" && type !== "product") {
      return HttpResponse.json(
        {
          data: [],
          total: 0,
        },
        {
          status: 200,
        }
      );
    }

    // Filters
    const q = url.searchParams.get("q");
    const page = url.searchParams.get("page");
    const itemsPerPage = url.searchParams.get("itemsPerPage");
    const sortBy = url.searchParams.get("sortBy");
    const orderBy = url.searchParams.get("orderBy");

    // Custom filters
    const required = url.searchParams.get("required");
    const optional = url.searchParams.get("optional");

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

    const database = type === "client" ? databaseClient : databaseProduct;

    // Filtering invoices
    let filteredItems = database
      .filter(
        (it) =>
          it.field.toLowerCase().includes(queryLowered) &&
          "" + it.required === (required || "" + it.required) &&
          "" + it.optional === (optional || "" + it.optional)
      )
      .reverse();

    // Sorting invoices
    if (sortByLocal) {
      // String sort
      if (sortByLocal === "field") {
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
  http.get<PathParams>("/api/required-fields/:type/:field", ({ params }) => {
    const type = params.type;
    const field = params.field;

    const database = type === "client" ? databaseClient : databaseProduct;

    const item = database.find((it) => it.field === field);

    if (!item) {
      return HttpResponse.json("Field no found with this type", {
        status: 404,
      });
    }

    return HttpResponse.json(item, { status: 200 });
  }),
];
