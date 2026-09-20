"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { v4 } from "uuid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import TemplateWidgetSelect from "@/features/board/components/display/select/TemplateWidgetSelect";
import { useUpdateBoard } from "@/features/board/hooks/useBoards";
import { TomatoIcon, TomatoIconKey } from "@tomato/icon";
import { ChartAggregation, ChartKind, BoardViewType } from "@/types/board-view";
import type { BoardChartViewConfig, BoardView } from "@/types/board-view";
import type { Board } from "@/types/board";
import { DisplayType } from "@/types/display-type";

const AGGREGATION_LABELS: Record<ChartAggregation, string> = {
  [ChartAggregation.COUNT]: "Count",
  [ChartAggregation.SUM]: "Sum",
  [ChartAggregation.AVG]: "Average",
};

const CHART_KIND_LABELS: Record<ChartKind, string> = {
  [ChartKind.BAR]: "Bar",
  [ChartKind.LINE]: "Line",
  [ChartKind.PIE]: "Pie",
};

interface ChartFormValues {
  name: string;
  groupBy: Record<string, string>;
  aggregation: ChartAggregation;
  valueField: Record<string, string>;
  chartKind: ChartKind;
}

function toFormValues(view?: BoardView): ChartFormValues {
  const config = view?.config as Partial<BoardChartViewConfig> | undefined;
  return {
    name: view?.name ?? "",
    groupBy: config?.groupBy ?? {},
    aggregation: config?.aggregation ?? ChartAggregation.COUNT,
    valueField: config?.valueField ?? {},
    chartKind: config?.chartKind ?? ChartKind.BAR,
  };
}

const chartViewSchema = Yup.object({
  name: Yup.string().trim().required("Name is required"),
  groupBy: Yup.object().test(
    "has-group-by",
    "Pick at least one group-by field",
    (value) => Boolean(value) && Object.keys(value).length > 0,
  ),
  aggregation: Yup.mixed<ChartAggregation>()
    .oneOf(Object.values(ChartAggregation))
    .required(),
  valueField: Yup.object().when("aggregation", {
    is: (aggregation: ChartAggregation) => aggregation !== ChartAggregation.COUNT,
    then: (schema) =>
      schema.test(
        "has-value-field",
        "Pick a value field to aggregate",
        (value) => Boolean(value) && Object.keys(value).length > 0,
      ),
  }),
  chartKind: Yup.mixed<ChartKind>().oneOf(Object.values(ChartKind)).required(),
});

export interface ChartSettingPopupProps {
  board: Board;
  /** Undefined = create mode; a view = edit mode. */
  view?: BoardView;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Create/edit settings for a Chart view: group-by field(s) per linked template, aggregation, value field, and chart kind. Saves immediately. */
const ChartSettingPopup: React.FC<ChartSettingPopupProps> = ({
  board,
  view,
  open,
  onOpenChange,
}) => {
  const { mutateAsync: updateBoard } = useUpdateBoard(board.id);

  const formik = useFormik<ChartFormValues>({
    initialValues: toFormValues(view),
    enableReinitialize: true,
    validateOnMount: true,
    validationSchema: chartViewSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const config: BoardChartViewConfig = {
        groupBy: values.groupBy,
        aggregation: values.aggregation,
        chartKind: values.chartKind,
        ...(values.aggregation !== ChartAggregation.COUNT
          ? { valueField: values.valueField }
          : {}),
      };
      const nextView: BoardView = {
        id: view?.id ?? v4(),
        name: values.name.trim(),
        type: BoardViewType.CHART,
        config,
      };
      const nextViews = view
        ? board.views.map((v) => (v.id === view.id ? nextView : v))
        : [...board.views, nextView];

      try {
        await updateBoard({ views: nextViews });
        toast.success(view ? "View updated" : "View created");
        onOpenChange(false);
      } catch (err) {
        console.error("Failed to save view:", err);
        toast.error("Failed to save view");
      } finally {
        setSubmitting(false);
      }
    },
  });

  function pickGroupBy(templateId: string, itemKey: string | null) {
    const groupBy = { ...formik.values.groupBy };
    if (itemKey) groupBy[templateId] = itemKey;
    else delete groupBy[templateId];
    formik.setFieldValue("groupBy", groupBy);
    formik.setFieldTouched("groupBy", true, false);
  }

  function pickValueField(templateId: string, itemKey: string | null) {
    const valueField = { ...formik.values.valueField };
    if (itemKey) valueField[templateId] = itemKey;
    else delete valueField[templateId];
    formik.setFieldValue("valueField", valueField);
    formik.setFieldTouched("valueField", true, false);
  }

  const needsValueField = formik.values.aggregation !== ChartAggregation.COUNT;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) formik.resetForm();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{view ? "Edit chart view" : "New chart view"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="chart-view-name">Name</Label>
            <Input
              id="chart-view-name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name ? formik.errors.name : undefined}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Group by</Label>
            {board.templates.map((template) => (
              <TemplateWidgetSelect
                key={template.id}
                template={template}
                allowDisplayTypes={null}
                value={formik.values.groupBy[template.id] ?? null}
                onChange={(itemKey) => pickGroupBy(template.id, itemKey)}
              />
            ))}
            {formik.touched.groupBy && formik.errors.groupBy && (
              <p className="text-xs text-destructive">
                {String(formik.errors.groupBy)}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Aggregation</Label>
            <Select
              value={formik.values.aggregation}
              onValueChange={(value) =>
                formik.setFieldValue("aggregation", value as ChartAggregation)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ChartAggregation).map((aggregation) => (
                  <SelectItem key={aggregation} value={aggregation}>
                    {AGGREGATION_LABELS[aggregation]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {needsValueField && (
            <div className="flex flex-col gap-1.5">
              <Label>Value field</Label>
              {board.templates.map((template) => (
                <TemplateWidgetSelect
                  key={template.id}
                  template={template}
                  allowDisplayTypes={[DisplayType.NUMBER]}
                  value={formik.values.valueField[template.id] ?? null}
                  onChange={(itemKey) => pickValueField(template.id, itemKey)}
                />
              ))}
              {formik.touched.valueField && formik.errors.valueField && (
                <p className="text-xs text-destructive">
                  {String(formik.errors.valueField)}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label>Chart kind</Label>
            <Select
              value={formik.values.chartKind}
              onValueChange={(value) =>
                formik.setFieldValue("chartKind", value as ChartKind)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ChartKind).map((kind) => (
                  <SelectItem key={kind} value={kind}>
                    {CHART_KIND_LABELS[kind]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!formik.isValid || formik.isSubmitting}>
              {formik.isSubmitting ? (
                <TomatoIcon icon={TomatoIconKey.Loader} className="size-4 animate-spin" />
              ) : view ? (
                "Save"
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChartSettingPopup;
