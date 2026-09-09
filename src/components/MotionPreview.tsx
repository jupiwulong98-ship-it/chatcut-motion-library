import { useEffect, useMemo, useRef } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { previewComponents } from "../cards/previews";
import { cardProps } from "../cards/bindings";
import type { CardManifest } from "../cards/types";

export function MotionPreview({ card, playing, onEnd }: { card: CardManifest; playing: boolean; onEnd: () => void }) {
  const player = useRef<PlayerRef>(null);
  const duration = Math.round(card.defaultDuration * 30);
  const settledFrame = Math.min(duration - 1, Math.round(duration * 0.7));
  const inputProps = useMemo(() => ({ item: { props: cardProps(card) } }), [card]);
  useEffect(() => {
    const instance = player.current;
    if (!instance) return;
    instance.addEventListener("ended", onEnd);
    if (playing) { instance.seekTo(0); instance.play(); }
    else { instance.pause(); instance.seekTo(settledFrame); }
    return () => instance.removeEventListener("ended", onEnd);
  }, [playing, settledFrame, onEnd]);
  const Card = previewComponents[card.id];
  if (!Card) return null;
  return <>
    <Player ref={player} component={Card} inputProps={inputProps}
      durationInFrames={duration} fps={30} compositionWidth={1920} compositionHeight={1080}
      initialFrame={settledFrame} initiallyMuted controls={false} clickToPlay={false}
      doubleClickToFullscreen={false} spaceKeyToPlayOrPause={false}
      style={{ width: "100%", height: "100%" }} aria-label={`${card.name}动画预览`} />
    {card.mediaSlots.length > 0 && <div className="media-binding-notice">需要在 ChatCut 绑定素材</div>}
  </>;
}
