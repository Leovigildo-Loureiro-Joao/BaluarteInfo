import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../utils/api.js";
import { AdminAuditLogDto, AdminAuditType, PageResponse } from "../../types/api";

const fmtData = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("pt-BR");
};

export const AuditLogsPage = () => {
  const [tipo, setTipo] = useState<AdminAuditType | "">("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [data, setData] = useState<PageResponse<AdminAuditLogDto> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const queryString = useMemo(() => {
    const qs = new URLSearchParams({ page: String(page), size: String(size) });
    if (tipo) qs.set("tipo", tipo);
    return qs.toString();
  }, [page, size, tipo]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await apiFetch(`/admin/profile/audit?${queryString}`, { signal: controller.signal });
        if (!res.ok) throw new Error("Falha ao carregar audit logs.");
        const payload = (await res.json()) as PageResponse<AdminAuditLogDto>;
        setData(payload);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setData(null);
        setError(err instanceof Error ? err.message : "Não foi possível carregar audit logs.");
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [queryString]);

  const content = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-950">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Audit Logs</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Registros recentes do painel admin.</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={tipo}
              onChange={(e) => {
                setPage(0);
                setTipo(e.target.value as AdminAuditType | "");
              }}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            >
              <option value="">Todos</option>
              <option value={AdminAuditType.INFO}>Info</option>
              <option value={AdminAuditType.SUCESSO}>Sucesso</option>
              <option value={AdminAuditType.ALERTA}>Alerta</option>
              <option value={AdminAuditType.ERRO}>Erro</option>
            </select>
          </div>
        </div>

        {error ? (
          <div className="mb-6 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl p-4">
            {error}
          </div>
        ) : null}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white">Registros</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white text-gray-700 disabled:opacity-60 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                disabled={loading || page <= 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Anterior
              </button>
              <button
                type="button"
                className="px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white text-gray-700 disabled:opacity-60 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                disabled={loading || totalPages === 0 || page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Próximo
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="px-6 py-4">
                  <div className="h-3 w-64 bg-gray-200 rounded mb-2 animate-pulse dark:bg-gray-800" />
                  <div className="h-3 w-40 bg-gray-200 rounded animate-pulse dark:bg-gray-800" />
                </div>
              ))
            ) : content.length === 0 ? (
              <div className="px-6 py-6 text-sm text-gray-500 dark:text-gray-400">
                Nenhum registro encontrado.
              </div>
            ) : (
              content.map((log) => (
                <div key={log.id} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{log.acao}</p>
                      {log.detalhes ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{log.detalhes}</p>
                      ) : null}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-200">{log.tipo}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{fmtData(log.data)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

