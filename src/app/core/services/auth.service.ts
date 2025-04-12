import { inject, Injectable, signal } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { PLATFORM_ID } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";
import { jwtDecode } from "jwt-decode";

import { environment } from "../../../environments/environment";
import {
  IAuthData,
  IJwtPayload,
  IRawAuthData,
} from "../models/auth-response.model";
import { IApiResponse } from "../models/api-response.model";
import { IRegisterData, IRegisterResponse } from "../models/register-response";

@Injectable({ providedIn: "root" })
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly version = environment.apiVersion;
  private readonly userSignal = signal<IJwtPayload | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getToken();
      if (token) {
        try {
          const decoded = jwtDecode<IJwtPayload>(token);

          this.userSignal.set(decoded);
        } catch (e) {
          this.userSignal.set(null);
        }
      }
    }
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem("access_token");

      if (!token) {
        return false;
      }

      try {
        const decoded = jwtDecode<{ exp: number }>(token);
        const expTime = decoded.exp * 1000;
        const now = Date.now();
        const isValid = expTime > now;

        return isValid;
      } catch (e) {
        return false;
      }
    }

    return false;
  }

  get user() {
    return this.userSignal.asReadonly();
  }

  login(data: FormData) {
    return this.http
      .post<IApiResponse<IRawAuthData>>(
        `${this.baseUrl}/${this.version}/auth/login`,
        data
      )
      .pipe(
        map((res) => {
          const accessToken = res.data.access_token;
          const decoded = jwtDecode<IJwtPayload>(accessToken);

          this.saveToken(accessToken);
          this.userSignal.set(decoded);

          return {
            success: res.success,
            message: res.message,
            data: {
              accessToken,
              tokenType: res.data.token_type,
            },
          } satisfies IApiResponse<IAuthData>;
        })
      );
  }

  register(username: string, email: string, password: string) {
    return this.http
      .post<IApiResponse<IRegisterData>>(
        `${this.baseUrl}/${this.version}/auth/register`,
        { username: username, email: email, password: password }
      )
      .pipe(
        map((res) => {
          return {
            success: res.success,
            message: res.message,
            data: {
              email,
              username,
            },
          } satisfies IApiResponse<IRegisterResponse>;
        })
      );
  }

  saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem("access_token", token);
    }
  }

  getToken(): string | null {
    return localStorage.getItem("access_token");
  }

  getDecodedToken(): IJwtPayload | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const decoded = jwtDecode<IJwtPayload>(token);
      return decoded;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem("access_token");
    }
  }
}
