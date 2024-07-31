import { PageName } from "../types/types";

let activePage: PageName = "loading";

export function get(): PageName {
  return activePage;
}

export function set(active: PageName): void {
  activePage = active;
}
