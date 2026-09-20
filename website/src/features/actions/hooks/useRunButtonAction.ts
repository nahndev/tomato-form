"use client";

import {
  ButtonActionContext,
  type RunButtonAction,
} from "@/features/actions/context/ButtonActionContext";
import { useContext } from "react";

export function useRunButtonAction(): RunButtonAction {
  return useContext(ButtonActionContext);
}
