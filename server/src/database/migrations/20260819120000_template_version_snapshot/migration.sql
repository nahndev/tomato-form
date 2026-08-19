-- Consolidate template_versions' widgets/layouts/widget_to_session/properties/sessions
-- columns into a single `snapshot` jsonb column, so adding a new record kind
-- (e.g. sessionProperties) no longer needs a schema migration.

-- AlterTable
ALTER TABLE "template_versions" ADD COLUMN "snapshot" JSONB NOT NULL DEFAULT '{}';

-- Migrate existing rows into the new column
UPDATE "template_versions"
SET "snapshot" = jsonb_build_object(
  'widgets', "widgets",
  'layouts', "layouts",
  'widgetToSession', "widget_to_session",
  'properties', "properties",
  'sessions', "sessions"
);

-- AlterTable
ALTER TABLE "template_versions"
  DROP COLUMN "widgets",
  DROP COLUMN "layouts",
  DROP COLUMN "widget_to_session",
  DROP COLUMN "properties",
  DROP COLUMN "sessions";
