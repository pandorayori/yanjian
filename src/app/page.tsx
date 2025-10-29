"use client";
import { useState } from "react";

type Resp = { gentle?: string; direct?: string; humor?: string; error?: string };

export default function Home() {
  const [text, setText] = useState("");
  const [res, setRes] = useState<Resp | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleRewrite() {
    if (!text.trim()) return;
    setLoading(true);
    setErr(null);
    setRes(null);
    try {
      const r = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = (await r.json()) as Resp;
      if (!r.ok) throw new Error(data?.error || "请求失败");
      setRes(data);
    } catch (e: any) {
      setErr(e.message || "网络异常");
    } finally {
      setLoading(false);
    }
  }

  async function copyToClipboard(s: string) {
    if (!s) return;
    await navigator.clipboard.writeText(s);
    alert("已复制到剪贴板");
  }

  const Card = ({
    title,
    body,
    emoji,
  }: {
    title: string;
    body?: string;
    emoji: string;
  }) => (
    <div
      className="rounded-xl border border-neutral-700/60 p-4 md:p-5 bg-neutral-900/40"
      style={{ backdropFilter: "blur(4px)" }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-semibold">
          {emoji} {title}
        </div>
        <button
          onClick={() => body && copyToClipboard(body)}
          className="text-sm px-3 py-1 rounded-md border border-neutral-600 hover:bg-neutral-800 active:scale-[0.98] transition"
        >
          复制
        </button>
      </div>
      <div className="whitespace-pre-wrap leading-7 text-neutral-200">
        {body || "（暂无内容）"}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen px-4 md:px-6 py-10 text-neutral-100 bg-black">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-center text-2xl md:text-3xl font-bold mb-2">
          🪶 言间 · AI沟通伴侣
        </h1>
        <p className="text-center text-neutral-400 mb-8">
          输入一句话，让 AI 生成「温柔 / 直接 / 幽默」三种表达。
        </p>

        <textarea
          rows={4}
          className="w-full rounded-xl border border-neutral-700/70 bg-neutral-900/50 p-4 outline-none focus:ring-2 focus:ring-neutral-600"
          placeholder="例如：你根本没在听我说话！"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleRewrite}
            disabled={loading || !text.trim()}
            className="px-5 py-2.5 rounded-lg bg-white text-black font-medium hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "生成中…" : "改写"}
          </button>
          {err && <span className="text-red-400 text-sm">{err}</span>}
        </div>

        {/* 结果区 */}
        {loading && (
          <div className="mt-8 text-neutral-400 italic">🌀 AI 正在思考更好的表达…</div>
        )}

        {res && (
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <Card title="温柔表达" emoji="💗" body={res.gentle} />
            <Card title="直接表达" emoji="⚡" body={res.direct} />
            <Card title="幽默表达" emoji="😄" body={res.humor} />
          </div>
        )}
      </div>
    </main>
  );
}