/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/portion`; params?: Router.UnknownInputParams; } | { pathname: `/recipe`; params?: Router.UnknownInputParams; } | { pathname: `/home`; params?: Router.UnknownInputParams; } | { pathname: `/inventory`; params?: Router.UnknownInputParams; } | { pathname: `/NavBar`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/instructions`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/portion`; params?: Router.UnknownOutputParams; } | { pathname: `/recipe`; params?: Router.UnknownOutputParams; } | { pathname: `/home`; params?: Router.UnknownOutputParams; } | { pathname: `/inventory`; params?: Router.UnknownOutputParams; } | { pathname: `/NavBar`; params?: Router.UnknownOutputParams; } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/instructions`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/portion${`?${string}` | `#${string}` | ''}` | `/recipe${`?${string}` | `#${string}` | ''}` | `/home${`?${string}` | `#${string}` | ''}` | `/inventory${`?${string}` | `#${string}` | ''}` | `/NavBar${`?${string}` | `#${string}` | ''}` | `/${`?${string}` | `#${string}` | ''}` | `/instructions${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/portion`; params?: Router.UnknownInputParams; } | { pathname: `/recipe`; params?: Router.UnknownInputParams; } | { pathname: `/home`; params?: Router.UnknownInputParams; } | { pathname: `/inventory`; params?: Router.UnknownInputParams; } | { pathname: `/NavBar`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/instructions`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
    }
  }
}
