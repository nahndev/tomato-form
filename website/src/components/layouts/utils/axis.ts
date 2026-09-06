import type { CrossAxisAlignment, MainAxisAlignment } from "../types";

export function mainAxisAlignmentToClass(value: MainAxisAlignment): string {
  switch (value) {
    case "start":
      return "justify-start";
    case "end":
      return "justify-end";
    case "center":
      return "justify-center";
    case "spaceBetween":
      return "justify-between";
    case "spaceAround":
      return "justify-around";
    case "spaceEvenly":
      return "justify-evenly";
  }
}

export function crossAxisAlignmentToClass(value: CrossAxisAlignment): string {
  switch (value) {
    case "start":
      return "items-start";
    case "end":
      return "items-end";
    case "center":
      return "items-center";
    case "stretch":
      return "items-stretch";
    case "baseline":
      return "items-baseline";
  }
}
