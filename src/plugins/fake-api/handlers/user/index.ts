import fakeUserStore, { RecoveryCode } from "@api-store/user";
import type { PathParams } from "msw";
import { HttpResponse, http } from "msw";
import { db } from "../auth/db";

export const handlerUser = [
  http.post<PathParams>("/api/user/sendRecoveryCode", async ({ request }) => {
    const { email } = (await request.json()) as {
      email: string;
    };

    const user = db.users.find(
      (u) => u.email === email
    );

    if (user) {
      const { addRecoveryCode } = fakeUserStore();

      const code = Math.floor(100000 + Math.random() * 900000).toString();

      const recoveryCode: RecoveryCode = {
        email,
        code
      }

      addRecoveryCode(recoveryCode);
      return HttpResponse.json({
        ...recoveryCode,
        message: "We have sent you an email with instructions on how to reset your password."
      }, { status: 200 });
    }
    
    // TODO: criar ApiError para tratar todas as respostas de erro da API Fake
    return HttpResponse.json({
      message: "We have sent you an email with instructions on how to reset your password."
    }, { status: 200 });
  }),
  http.post<PathParams>("/api/user/validateRecoveryCode", async ({ request }) => {
    const recoveryCode = (await request.json()) as RecoveryCode;

    let errors: Record<string, string[]> = {
      email: ["Something went wrong"],
      code: ["Something went wrong"],
    };

    try {
      const { verifyRecoveryCode } = fakeUserStore();
  
      if(!verifyRecoveryCode(recoveryCode)) {
        errors = { code: ["Invalid recovery code!"] };
        return HttpResponse.json({ errors }, { status: 401 });
      }
      
      return HttpResponse.json({
        valid: true
      }, { status: 200 });
    } catch (e: unknown) {
      errors = { code: [e as string] };
    }
  }),
];
