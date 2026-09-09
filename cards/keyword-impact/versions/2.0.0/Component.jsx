const Component = ({ item }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const p = item.props || {};
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
  const seconds = frame / fps;
  const fade = (delay, duration = 0.1) => interpolate(seconds, [delay, delay + duration], [0, 1], clamp);
  const enter = (delay, damping = 22) => spring({ frame: frame - delay * fps, fps, config: { damping, stiffness: 250, mass: 0.8 } });
  const motion = (delay, x = 0, y = 20, scale = 0.94) => {
    const progress = enter(delay);
    return { opacity: fade(delay), transform: `translate(${x * (1 - progress)}px, ${y * (1 - progress)}px) scale(${scale + (1 - scale) * progress})` };
  };
  const mediaStyle = { display: "block", width: "100%", height: "100%", objectFit: "cover" };
  const containStyle = { ...mediaStyle, objectFit: "contain" };
  const sceneStyle = { position: "absolute", width: 1920, height: 1080, transformOrigin: "0 0", transform: `scale(${width / 1920}, ${height / 1080})` };
  const characters = Array.from(p.text);
  const wordStyle = { position: "absolute", left: 250, top: 315, width: 1420, display: "flex", justifyContent: "center", whiteSpace: "nowrap", fontSize: Math.min(p.fontSize, 1420 / Math.max(characters.length - 0.8, 1)), fontWeight: 700, letterSpacing: -8, lineHeight: 1.15, color: p.color, textShadow: "3px 5px 4px rgba(0,0,0,.55)" };

  const rootStyle = { position: "absolute", inset: 0, overflow: "hidden", backgroundColor: "transparent", fontFamily: p.fontFamily };
  return <div style={rootStyle}><div style={sceneStyle}>
<div style={wordStyle}>{characters.map((character, index) => {
    // The last character lands first; the whole word is assembled in about 0.2 seconds.
    const delay = 0.02 + (characters.length - 1 - index) * 0.025;
    const progress = enter(delay, 24);
    const style = { display: "inline-block", opacity: fade(delay, 0.025), transform: `translateX(${(1 - progress) * 46}px) scale(${0.92 + progress * 0.08})` };
    return <span key={index} style={style}>{character}</span>;
  })}</div>
  </div></div>;
};
