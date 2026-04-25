import type { Profile } from "@db/profiles/types";

export const database: Profile[] = [
  {
    id: 1,
    name: "Administrador",
    active: true,
  },
  {
    id: 2,
    name: "Usuário",
    active: true,
  },
  {
    id: 3,
    name: "Moderador",
    active: true,
  },
  {
    id: 4,
    name: "Visitante",
    active: false,
  },
  {
    id: 5,
    name: "Desenvolvedor",
    active: true,
  },
];
