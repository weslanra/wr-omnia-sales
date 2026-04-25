import { paginateArray } from "@api-utils/paginateArray";
import { database } from "@db/profiles/db";
import is from "@sindresorhus/is";
import destr from "destr";
import type { PathParams } from "msw";
import { HttpResponse, http } from "msw";

export const handlerProfiles = [
  // 👉 Users
  // Get users list
  http.get("/api/profiles", ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
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
    let items = database
      .filter(
        (it) =>
          it.name.toLowerCase().includes(queryLowered) &&
          "" + it.active === (active || "" + it.active)
      )
      .reverse();

    // Sorting invoices
    if (sortByLocal) {
      // String sort
      if (sortByLocal === "name") {
        items = items.sort((a, b) => {
          if (orderByLocal === "asc")
            return a[sortByLocal].localeCompare(b[sortByLocal]);

          return b[sortByLocal].localeCompare(a[sortByLocal]);
        });
      }
      // number sort
      else if (sortByLocal === "id") {
        items = items.sort((a, b) => {
          if (orderByLocal === "asc") return a[sortByLocal] - b[sortByLocal];

          return b[sortByLocal] - a[sortByLocal];
        });
      }
    }

    const total = items.length;

    return HttpResponse.json(
      {
        data: paginateArray(items, itemsPerPageLocal, pageLocal),
        total,
      },
      {
        status: 200,
      }
    );
  }),

  // Get user
  http.get<PathParams>("/api/profiles/:id", ({ params }) => {
    const id = params.id;

    const profile = database.find((e) => e.id === Number(id));

    if (!profile) {
      return HttpResponse.json("No profile found with this id", {
        status: 404,
      });
    }

    return HttpResponse.json(profile, { status: 200 });
  }),
];
