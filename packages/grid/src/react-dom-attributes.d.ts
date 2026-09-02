// `inert` is a standard HTML global attribute missing from this @types/react version.
import "react";

declare module "react" {
  interface HTMLAttributes<T> {
    inert?: boolean;
  }
}
