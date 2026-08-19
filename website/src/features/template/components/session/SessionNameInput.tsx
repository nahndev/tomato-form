"use client";

import { Input } from "@/components/ui/input";
import { useSessionId } from "@/features/template/components/session/SessionProvider";
import { useSessionActions } from "@/features/template/hooks/actions/useSessionActions";
import { useSessionState } from "@/features/template/hooks/state/useSessionState";
import { useFormik } from "formik";
import * as Yup from "yup";

const schema = Yup.object({
  name: Yup.string().required("Session name is required"),
});

/** Inline-editable session name, backed directly by the yjs doc. */
export function SessionNameInput() {
  const sessionId = useSessionId();
  const { properties } = useSessionState();
  const { updateSession } = useSessionActions();

  const formik = useFormik({
    initialValues: { name: properties?.name ?? "" },
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values) => updateSession(sessionId, { name: values.name }),
  });

  return (
    <Input
      value={formik.values.name}
      onChange={formik.handleChange("name")}
      onBlur={(e) => {
        formik.handleBlur("name")(e);
        if (formik.isValid) formik.submitForm();
      }}
      error={formik.touched.name ? formik.errors.name : undefined}
      placeholder="Session name…"
      className="h-auto border-transparent bg-transparent px-1.5 py-0.5 font-medium text-2xl shadow-none hover:border-input focus-visible:border-input"
    />
  );
}
