import { CurrencyPipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "dynamicCurrency",
  standalone: true,
})
export class DynamicCurrencyPipe implements PipeTransform {
  transform(value: number, currencyCode: string): string {
    const currencyPipe = new CurrencyPipe("en-US");
    return currencyPipe.transform(value, currencyCode) || "";
  }
}
