import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../../environments/environment";
import { IApiResponse } from "../models/api-response.model";
import { map } from "rxjs";
import {
  IBank,
  IFormField,
  InstitutionsResponse,
  IValueFormField,
} from "../models/bank.model";
import { ILinkBankData } from "../models/link.model";
import { IBalance } from "../models/balance.model";

@Injectable({ providedIn: "root" })
export class BelvoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly version = environment.apiVersion;

  constructor() {}

  getBanks() {
    return this.http
      .get<IApiResponse<unknown>>(
        `${this.baseUrl}/${this.version}/belvo/institutions`
      )
      .pipe(map((res) => this.mapInstitutionResponse(res)));
  }

  getLinkBank(name: string) {
    return this.http
      .get<IApiResponse<{ link_id: string }>>(
        `${this.baseUrl}/${this.version}/belvo/link-institution/?name=${name}`
      )
      .pipe(map((res) => res));
  }

  getAccounts(linkId: string) {
    return this.http
      .post<IApiResponse<any>>(
        `${this.baseUrl}/${this.version}/belvo/accounts`,
        { link: linkId }
      )
      .pipe(map((res) => res));
  }

  createLinkBank(data: ILinkBankData) {
    return this.http
      .post<IApiResponse<{ id: string }>>(
        `${this.baseUrl}/${this.version}/belvo/create-link`,
        data
      )
      .pipe(map((res) => res.data));
  }

  getBalanceTransactions(
    accountId: string,
    linkId: string,
    dateFrom: string,
    dateTo: string
  ) {
    return this.http
      .post<IApiResponse<IBalance>>(
        `${this.baseUrl}/${this.version}/belvo/balance`,
        {
          account: accountId,
          link: linkId,
          date_from: dateFrom,
          date_to: dateTo,
        }
      )
      .pipe(map((res) => res.data));
  }

  private mapInstitutionResponse(response: any): InstitutionsResponse {
    const institutions: IBank[] = response.data.institutions.map(
      (institution: any) => ({
        id: institution.id,
        name: institution.name,
        displayName: institution.display_name,
        logo: institution.logo,
        iconLogo: institution.icon_logo,
        textLogo: institution.text_logo,
        country: institution.country,
        status: institution.status,
        formFields: institution.form_fields.map(
          (field: any): IFormField => ({
            name: field.name,
            type: field.type,
            validation: field.validation,
            values: field.values
              ? field.values.map(
                  (v: any): IValueFormField => ({
                    code: v.code,
                    label: v.label,
                  })
                )
              : null,
          })
        ),
      })
    );

    return {
      count: response.data.count,
      institutions,
    };
  }
}
