import { db } from "@db/auth/db";
import type { User, UserOut } from "@db/auth/types";
import type { PathParams } from "msw";
import { HttpResponse, http } from "msw";
import JWT from "./jwt";

const jwt = new JWT(
  new TextEncoder().encode(import.meta.env.JWT_SECRET || "your-256-bit-secret")
);

const jwtRefresh = new JWT(
  new TextEncoder().encode(
    import.meta.env.JWT_REFRESH_SECRET || "your-256-bit-secret"
  ),
  {
    expirationTime: "2d",
  }
);

const UserOutFactor = async (userData: User): Promise<UserOut> => {
  const accessToken = await jwt.generate(userData);
  const refreshToken = await jwtRefresh.generate({ id: userData.id });

  const userOutData = Object.fromEntries(
    Object.entries(userData).filter(
      ([key, _]) => !(key === "password" || key === "abilityRules")
    )
  ) as UserOut["userData"];

  return {
    userAbilityRules: userData.abilityRules,
    accessToken,
    refreshToken,
    userData: userOutData,
  };
};

export const handlerAuth = [
  http.post<PathParams>("/api/auth/login", async ({ request }) => {
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };

    let errors: Record<string, string[]> = {
      email: ["Something went wrong"],
    };

    const user = db.users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      try {
        // We are duplicating user here
        const userData = { ...user };
        const response = await UserOutFactor(userData);

        return HttpResponse.json(response, { status: 201 });
      } catch (e: unknown) {
        errors = { email: [e as string] };
      }
    } else {
      errors = { email: ["Invalid email or password"] };
    }

    return HttpResponse.json({ errors }, { status: 400 });
  }),
  http.post<PathParams>("/api/auth/refreshToken", async ({ request }) => {
    const { token, refreshToken } = (await request.json()) as {
      token: string;
      refreshToken: string;
      expiresAt: string | number | Date;
    };

    let errors: Record<string, string[]> = {
      token: ["Something went wrong"],
      refreshToken: ["Something went wrong"],
    };

    try {
      const isValid = await jwt.verify(token);
      const isRefreshTokenValid = await jwtRefresh.verify(refreshToken);

      if (!isValid) {
        errors = { token: ["Invalid token!"] };
        return HttpResponse.json({ errors }, { status: 403 });
      }

      if (!isRefreshTokenValid) {
        errors = { refreshToken: ["Invalid refreshToken!"] };
        return HttpResponse.json({ errors }, { status: 403 });
      }

      const payload = await jwt.decode(token);

      if (!payload) new Error("Something went wrong");

      const user = payload as User;

      // We are duplicating user here
      const userData = { ...user };
      const response = await UserOutFactor(userData);

      return HttpResponse.json(response, { status: 200 });
    } catch (e: unknown) {
      errors = { token: [e as string] };
    }
  }),
  http.post<PathParams>("/api/auth/register", async ({ request }) => {
    const { userName, email, password } = (await request.json()) as {
      userName: string;
      email: string;
      password: string;
    };

    let errors: Record<string, string[]> = {
      email: ["Something went wrong"],
    };

    const user = db.users.find((u) => u.email === email);

    if (!user) {
      try {
        // We are duplicating user here
        const userData: User = {
          id: db.users.length + 1,
          fullName: userName,
          username: userName,
          password,
          email,
          role: "client",
          avatar: `${
            import.meta.env.BASE_URL ?? "/"
          }images/avatars/avatar-2.png`,
          abilityRules: [
            {
              action: "manage",
              subject: "all",
            },
          ],
        };
        const response = await UserOutFactor(userData);

        return HttpResponse.json(response, { status: 201 });
      } catch (e: unknown) {
        errors = { email: [e as string] };
      }
    } else {
      errors = { email: ["This email is already in use"] };
    }

    return HttpResponse.json({ errors }, { status: 400 });
  }),
];
