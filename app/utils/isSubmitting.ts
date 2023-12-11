import { useNavigation } from "@remix-run/react";
import type { Navigation } from "@remix-run/router";

// const isActionReload = (navigation: Navigation, pathname?: string) =>
//   navigation.state === "loading" &&
//   navigation.formMethod != null &&
//   navigation.formMethod != "get" &&
//   // We had a submission navigation and are loading the submitted location
//   navigation.formAction === pathname;

const isActionRedirect = (navigation: Navigation, pathname?: string) =>
  navigation.state === "loading" &&
  navigation.formMethod != null &&
  navigation.formMethod != "get" &&
  // We had a submission navigation and are now navigating to different location
  navigation.formAction !== pathname;

// If the action redirects to a different path, we need to pass that path to the function
export const isRouteSubmitting = (
  navigation: Navigation,
  redirectPath?: string,
) =>
  (navigation.state === "submitting" &&
    navigation.formAction === navigation.location.pathname) ||
  // isActionReload(navigation, navigation.location?.pathname) ||
  isActionRedirect(navigation, redirectPath ?? navigation.location?.pathname);

export const isSubmittingByPath = (
  path: string,
  navigation: Navigation,
  redirectPath?: string,
) =>
  (navigation.state === "submitting" && navigation.formAction === path) ||
  // isActionReload(navigation, path) ||
  isActionRedirect(navigation, redirectPath ?? path);

export const useIsRouteSubmitting = (redirectPath?: string) => {
  const navigation = useNavigation();
  return isRouteSubmitting(navigation, redirectPath);
};
