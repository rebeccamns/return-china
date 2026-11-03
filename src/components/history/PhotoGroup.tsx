"use client";

import { useI18n } from "@/i18n";
import type { PhotoInput } from "@/lib/mo-detail/types";
import PhotoPreview from "./PhotoPreview";

export default function PhotoGroup({ photos }: { photos: PhotoInput }) {
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-1">
      <PhotoPreview label={t("history.detail.fields.frontPhoto")} src={photos.front} />
      <PhotoPreview label={t("history.detail.fields.backPhoto")} src={photos.back} />
      <PhotoPreview label={t("history.detail.fields.upnPhoto")} src={photos.upn} />
    </div>
  );
}
