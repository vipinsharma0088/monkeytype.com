import { Auth, isAuthenticated } from "../firebase";

const el = $("header .signInOut");

export function update(): void {
  if (!Auth) {
    el.addClass("hidden");
  } else {
    el.removeClass("hidden");
  }

  if (isAuthenticated()) {
    el.find(".icon").html(
      `<i class="fas fa-fw fa-sign-out-alt" aria-label="Sign out"></i>`
    );
  } else {
    el.find(".icon").html(
      `<i class="far fa-fw fa-user" aria-label="Sign in"></i>`
    );
  }
}
