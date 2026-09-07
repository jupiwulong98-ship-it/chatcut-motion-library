import { useCallback, useState } from "react";
import { cards } from "./cards/catalog";
import type { CardManifest } from "./cards/types";
import { MotionPreview } from "./components/MotionPreview";
import "./styles.css";

function Preview({ card, large = false }: { card: CardManifest; large?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const stopPlaying = useCallback(() => setPlaying(false), []);
  return <div className={`preview ${large ? "preview-large" : ""}`} data-testid="card-preview" data-playing={playing}>
    <MotionPreview card={card} playing={playing} onEnd={stopPlaying} />
    {!playing && <button className="play" aria-label="播放预览" onClick={(event) => { event.stopPropagation(); setPlaying(true); }}>▶</button>}
  </div>;
}

function Detail({ card, onBack }: { card: CardManifest; onBack: () => void }) {
  return <main className="shell"><button className="back" onClick={onBack}>← 返回卡片库</button><section className="detail"><Preview card={card} large/><div><p className="eyebrow">{card.id} · v{card.version}</p><h1>{card.name}</h1><p className="description">{card.description}</p><dl><dt>默认时长</dt><dd>{card.defaultDuration} 秒</dd><dt>AI 需要填写</dt><dd>{card.properties.map(item => item.label).join("、")}</dd><dt>手动绑定素材</dt><dd>{card.mediaSlots.length ? card.mediaSlots.map(item => item.label).join("、") : "不需要"}</dd><dt>历史版本</dt><dd>v{card.version}</dd></dl></div></section></main>;
}

export function App() {
  const [selected, setSelected] = useState<CardManifest | null>(null);
  if (selected) return <Detail card={selected} onBack={() => setSelected(null)} />;
  return <main className="shell"><header><p className="eyebrow">CHATCUT MOTION LIBRARY</p><h1>ChatCut 原生动效卡片库</h1><p className="description">8 张已发布的标准动效卡。网页只用来看效果，时间线操作由 AI 在 ChatCut 中完成。</p></header><section className="grid">{cards.map(card => <article className="card" key={card.id} onClick={() => setSelected(card)}><Preview card={card}/><div className="card-copy"><div><h2>{card.name}</h2><p>{card.description}</p></div><span>{card.defaultDuration}s · v{card.version}</span></div></article>)}</section></main>;
}
