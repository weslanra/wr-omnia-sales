import { setupWorker } from "msw/browser";

// Handlers
import { handlerCliente } from "@/plugins/fake-api/handlers/clients/index";
import { handlerPointsOfSale } from "@/plugins/fake-api/handlers/points-of-sale/index";
import { handlerAppBarSearch } from "@db/app-bar-search/index";
import { handlerAppsAcademy } from "@db/apps/academy/index";
import { handlerAppsCalendar } from "@db/apps/calendar/index";
import { handlerAppsChat } from "@db/apps/chat/index";
import { handlerAppsEcommerce } from "@db/apps/ecommerce/index";
import { handlerAppsEmail } from "@db/apps/email/index";
import { handlerAppsInvoice } from "@db/apps/invoice/index";
import { handlerAppLogistics } from "@db/apps/logistics/index";
import { handlerAppsPermission } from "@db/apps/permission/index";
import { handlerAppsUsers } from "@db/apps/users/index";
import { handlerCompanies } from "@db/companies/index";
import { handlerDashboard } from "@db/dashboard/index";
import { handlerPagesDatatable } from "@db/pages/datatable/index";
import { handlerPagesFaq } from "@db/pages/faq/index";
import { handlerPagesHelpCenter } from "@db/pages/help-center/index";
import { handlerPagesProfile } from "@db/pages/profile/index";
import { handlerProfiles } from "@db/profiles/index";
import { handlerRequiredFields } from "@db/required-fields/index";
import { handlerUsers } from "@db/users/index";

// Definitive services
import { handlerAuth } from "@db/auth/index";
import { handlerUser } from "@db/user/index";

const worker = setupWorker(
  ...handlerAppsEcommerce,
  ...handlerAppsAcademy,
  ...handlerAppsInvoice,
  ...handlerAppsUsers,
  ...handlerAppsEmail,
  ...handlerAppsCalendar,
  ...handlerAppsChat,
  ...handlerAppsPermission,
  ...handlerPagesHelpCenter,
  ...handlerPagesProfile,
  ...handlerPagesFaq,
  ...handlerPagesDatatable,
  ...handlerAppBarSearch,
  ...handlerAppLogistics,
  ...handlerDashboard,
  ...handlerAuth,
  ...handlerUser,
  ...handlerCliente,
  ...handlerUsers,
  ...handlerProfiles,
  ...handlerCompanies,
  ...handlerPointsOfSale,
  ...handlerRequiredFields
);

export default function () {
  const workerUrl = `${import.meta.env.BASE_URL ?? "/"}mockServiceWorker.js`;

  worker.start({
    serviceWorker: {
      url: workerUrl,
    },
    onUnhandledRequest: "bypass",
  });
}
