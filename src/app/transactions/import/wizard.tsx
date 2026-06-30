"use client";

import { useState, useRef } from "react";
import { importCsv } from "@/server/actions/import-csv";
import type { CsvRow } from "@/server/actions/import-csv";
import type { Account, Category } from "@/types";

interface ParsedPreview {
  headers: string[];
  rows: Record<string, string>[];
}

type ColumnMap = {
  date: string;
  description: string;
  amount: string;
};

type Step = "upload" | "map" | "confirm" | "result";

export function CsvImportWizard({
  accounts,
  categories,
}: {
  accounts: Pick<Account, "id" | "name">[];
  categories: Pick<Category, "id" | "name">[];
}) {
  const [step, setStep] = useState<Step>("upload");
  const [preview, setPreview] = useState<ParsedPreview | null>(null);
  const [columnMap, setColumnMap] = useState<ColumnMap>({
    date: "",
    description: "",
    amount: "",
  });
  const [accountId, setAccountId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [result, setResult] = useState<{
    imported: number;
    skipped: number;
    errors: string[];
  } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [rawRows, setRawRows] = useState<CsvRow[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function parseCSV(text: string): ParsedPreview {
    const lines = text.split("\n").filter((l) => l.trim());
    if (lines.length < 2) return { headers: [], rows: [] };

    const headers = parseLine(lines[0]);
    const rows = lines.slice(1).map((line) => {
      const vals = parseLine(line);
      const row: Record<string, string> = {};
      headers.forEach((h, i) => {
        row[h] = vals[i] || "";
      });
      return row;
    });

    return { headers, rows };
  }

  function parseLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }

  function autoDetectColumns(
    headers: string[]
  ): ColumnMap {
    const map: ColumnMap = { date: "", description: "", amount: "" };

    for (const h of headers) {
      const lower = h.toLowerCase().trim();
      if (
        /date|data|posted|transact/.test(lower) &&
        !map.date
      ) {
        map.date = h;
      } else if (
        /amount|value|sum|€|\$/.test(lower) &&
        !map.amount
      ) {
        map.amount = h;
      } else if (
        /desc|memo|narrative|payee|merchant|detail|name/.test(
          lower
        ) &&
        !map.description
      ) {
        map.description = h;
      }
    }

    if (!map.date) map.date = headers[0] || "";
    if (!map.description) {
      const candidates = headers.filter(
        (h) => h !== map.date && h !== map.amount
      );
      map.description = candidates[0] || "";
    }
    if (!map.amount) {
      const candidates = headers.filter(
        (h) => h !== map.date && h !== map.description
      );
      map.amount = candidates[0] || "";
    }

    return map;
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const parsed = parseCSV(text);
      setPreview(parsed);
      setColumnMap(autoDetectColumns(parsed.headers));
      setStep("map");
    };
    reader.readAsText(file);
  }

  function buildRows(): CsvRow[] {
    if (!preview) return [];
    return preview.rows.map((r) => ({
      date: r[columnMap.date] || "",
      description: r[columnMap.description] || "",
      amount: parseFloat(r[columnMap.amount]) || 0,
    }));
  }

  async function handleImport() {
    setProcessing(true);
    const rows = buildRows();
    const res = await importCsv({ rows, accountId, categoryId: categoryId || undefined });
    setResult(res);
    setRawRows([]);
    setStep("result");
    setProcessing(false);
  }

  return (
    <div className="space-y-6">
      {step === "upload" && (
        <div
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 p-12 dark:border-zinc-600"
          onClick={() => fileInputRef.current?.click()}
        >
          <p className="mb-2 text-3xl">📄</p>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            Click to select a CSV file
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            Files with .csv extension only
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      )}

      {step === "map" && preview && (
        <>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-950">
            <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Column Mapping
            </h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">
                  Date column
                </label>
                <select
                  value={columnMap.date}
                  onChange={(e) =>
                    setColumnMap({ ...columnMap, date: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  {preview.headers.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">
                  Description column
                </label>
                <select
                  value={columnMap.description}
                  onChange={(e) =>
                    setColumnMap({
                      ...columnMap,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  {preview.headers.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">
                  Amount column
                </label>
                <select
                  value={columnMap.amount}
                  onChange={(e) =>
                    setColumnMap({ ...columnMap, amount: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  {preview.headers.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-950">
            <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Preview ({preview.rows.length} rows found)
            </h3>
            <div className="mb-4 max-h-48 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-700">
                    <th className="px-2 py-1 font-medium text-zinc-500">
                      Date
                    </th>
                    <th className="px-2 py-1 font-medium text-zinc-500">
                      Description
                    </th>
                    <th className="px-2 py-1 text-right font-medium text-zinc-500">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {buildRows()
                    .slice(0, 5)
                    .map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-zinc-100 dark:border-zinc-800"
                      >
                        <td className="px-2 py-1 text-zinc-600">
                          {row.date}
                        </td>
                        <td className="px-2 py-1 text-zinc-900 dark:text-zinc-100">
                          {row.description}
                        </td>
                        <td className="px-2 py-1 text-right text-zinc-600">
                          {row.amount}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">
                  Target account
                </label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  required
                  className="w-full rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  <option value="">Select account</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">
                  Default category (optional)
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  <option value="">Uncategorized</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep("upload")}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-600 dark:text-zinc-300"
            >
              Back
            </button>
            <button
              onClick={handleImport}
              disabled={!accountId || processing}
              className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {processing ? "Importing..." : `Import ${buildRows().length} rows`}
            </button>
          </div>
        </>
      )}

      {step === "result" && result && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-950">
          <div className="mb-4 text-center">
            <p className="mb-2 text-3xl">
              {result.imported > 0 ? "✅" : "⚠️"}
            </p>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Import Complete
            </h3>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-zinc-600 dark:text-zinc-300">
              Imported: <strong>{result.imported}</strong>
            </p>
            <p className="text-zinc-600 dark:text-zinc-300">
              Skipped (duplicates): <strong>{result.skipped}</strong>
            </p>
            {result.errors.length > 0 && (
              <div>
                <p className="text-red-500">
                  Errors: <strong>{result.errors.length}</strong>
                </p>
                <ul className="mt-1 max-h-32 space-y-1 overflow-y-auto text-xs text-red-400">
                  {result.errors.slice(0, 10).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="mt-6 flex gap-3">
            <a
              href="/transactions"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              View Transactions
            </a>
            <button
              onClick={() => {
                setStep("upload");
                setPreview(null);
                setResult(null);
              }}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-600 dark:text-zinc-300"
            >
              Import Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
