"use client";

import { useState } from "react";
import { CircleCheck, CircleX, Folder, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import { cn } from "@/lib/utils";

import EximMaterialTable from "./_components/EximMaterialTable";
import { pendingMos, type EximMo, type EximRow } from "./_lib/data";

type Notice = { type: "success" | "reject"; message: string };

export default function EximPage() {
  const [mos, setMos] = useState<EximMo[]>(pendingMos);
  const [selectedCode, setSelectedCode] = useState("");
  const [loaded, setLoaded] = useState<{ code: string; rows: EximRow[] } | null>(
    null,
  );
  const [notice, setNotice] = useState<Notice | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const total = loaded?.rows.length ?? 0;
  const filled =
    loaded?.rows.filter((r) => r.model.trim() && r.brand.trim()).length ?? 0;
  const canSubmit = total > 0 && filled === total;

  function handleSearch() {
    const mo = mos.find((m) => m.code === selectedCode);
    if (!mo) return;

    setNotice(null);
    setLoaded({
      code: mo.code,
      rows: mo.materials.map((m) => ({ ...m, model: "", brand: "" })),
    });
  }

  function updateRow(id: string, field: "model" | "brand", value: string) {
    setLoaded((prev) =>
      prev
        ? {
            ...prev,
            rows: prev.rows.map((r) =>
              r.id === id ? { ...r, [field]: value } : r,
            ),
          }
        : prev,
    );
  }

  // Remove the MO from this queue and show the result
  function finish(code: string, type: Notice["type"], message: string) {
    setMos((prev) => prev.filter((m) => m.code !== code));
    setLoaded(null);
    setSelectedCode("");
    setNotice({ type, message });
  }

  function handleSubmit() {
    if (!loaded || !canSubmit) return;

    // TODO: POST { moCode: loaded.code, materials: loaded.rows.map(r => ({ id: r.id, model: r.model, brand: r.brand })) }
    finish(
      loaded.code,
      "success",
      `MO ${loaded.code} submitted. It moves on to Staff Return (sticker scan).`,
    );
  }

  function handleReject() {
    if (!loaded || !rejectReason.trim()) return;

    // TODO: POST { moCode: loaded.code, reason: rejectReason }
    finish(
      loaded.code,
      "reject",
      `MO ${loaded.code} rejected and sent back to Staff Return.`,
    );
    setRejectOpen(false);
    setRejectReason("");
  }

  return (
    <main className="min-h-screen w-full bg-backgroundbg-gray">
      <Sidebar variant="exim" />

      <div className="flex min-h-screen flex-col pl-[255px]">
        <TopBar />

        <div className="mt-[52px] w-full px-[18px] py-5">
          <nav className="mb-4 text-xs text-text-colortext-gray">Exim</nav>

          <h1 className="mb-4 text-lg font-semibold text-[#111111]">Exim</h1>

          {notice && (
            <div
              role="status"
              className={cn(
                "mb-4 flex items-start gap-3 rounded-lg border px-4 py-3 text-xs",
                notice.type === "success"
                  ? "border-[#B7DEC4] bg-[#EAF6EE] text-[#0b5934]"
                  : "border-red-200 bg-red-50 text-red-700",
              )}
            >
              {notice.type === "success" ? (
                <CircleCheck className="mt-px h-4 w-4 shrink-0" />
              ) : (
                <CircleX className="mt-px h-4 w-4 shrink-0" />
              )}
              <span className="flex-1">{notice.message}</span>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => setNotice(null)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="overflow-hidden rounded-lg border border-strokestroke-gray bg-white">
            {/* MO picker */}
            <div className="flex items-center gap-3 px-[18px] py-[18px]">
              <span className="text-sm text-[#111111]">MO</span>

              <Select
                value={selectedCode}
                onValueChange={setSelectedCode}
                disabled={mos.length === 0}
              >
                <SelectTrigger className="h-10 w-[340px] rounded-md border-strokestroke-gray text-sm">
                  <SelectValue placeholder="Select MO" />
                </SelectTrigger>
                <SelectContent>
                  {mos.map((mo) => (
                    <SelectItem key={mo.code} value={mo.code} className="text-sm">
                      {mo.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="button"
                disabled={!selectedCode}
                onClick={handleSearch}
                className="h-10 rounded-md bg-gradient-to-b from-[#058346] to-[#0B5934] px-4 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300"
              >
                Search MO
              </Button>
            </div>

            <div className="border-t border-strokestroke-gray" />

            {/* Material list */}
            <div className="px-[18px] pb-[18px] pt-4">
              <h2 className="mb-3 text-sm font-semibold text-[#111111]">
                Material List
              </h2>

              {loaded ? (
                <>
                  <div className="mb-4 inline-flex h-8 items-center rounded-full bg-[#F4F4F4] px-4 text-xs">
                    <span className="text-[#8F8F8E]">MO</span>
                    <span className="ml-5 font-medium text-[#111111]">
                      {loaded.code}
                    </span>
                  </div>

                  <EximMaterialTable rows={loaded.rows} onChange={updateRow} />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-50">
                    <Folder className="h-6 w-6 text-slate-700" strokeWidth={1.5} />
                  </div>

                  <p className="text-base font-medium text-[#111111]">
                    {mos.length === 0 ? "No MO waiting" : "No MO Selected"}
                  </p>
                  <p className="mt-1 text-sm text-[#8F8F8E]">
                    {mos.length === 0
                      ? "New MOs appear here after Staff Return submits them."
                      : "Select an MO and click search to view its material list."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {loaded && (
            <div className="mt-4 flex items-center justify-end gap-3">
              <span className="mr-auto text-xs text-[#5F5F5E]">
                {filled} of {total} materials complete
              </span>

              <Button
                type="button"
                variant="outline"
                onClick={() => setRejectOpen(true)}
                className="h-10 w-36 gap-2 rounded-md border-strokestroke-gray bg-white text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-600"
              >
                <X className="h-4 w-4" />
                Reject
              </Button>

              <Button
                type="button"
                disabled={!canSubmit}
                onClick={handleSubmit}
                className={cn(
                  "h-10 w-36 gap-2 rounded-md text-sm font-semibold text-white",
                  canSubmit
                    ? "bg-gradient-to-b from-[#058346] to-[#0B5934] hover:opacity-90"
                    : "cursor-not-allowed bg-slate-300 hover:bg-slate-300",
                )}
              >
                <Send className="h-4 w-4" />
                Submit
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Reject dialog */}
      <Dialog
        open={rejectOpen}
        onOpenChange={(open) => {
          setRejectOpen(open);
          if (!open) setRejectReason("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject this MO?</DialogTitle>
            <DialogDescription>
              {loaded?.code} goes back to Staff Return so the carton data can be
              revised. Your reason is shown to the operator.
            </DialogDescription>
          </DialogHeader>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#111111]">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Explain why this MO is rejected..."
              className="w-full resize-none rounded-md border border-strokestroke-gray px-3 py-2 text-xs outline-none placeholder:text-[#A3A3A1] focus:border-primaryprimary-green"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRejectOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!rejectReason.trim()}
              onClick={handleReject}
              className="bg-red-600 text-white hover:bg-red-700 disabled:bg-slate-300"
            >
              Reject MO
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}