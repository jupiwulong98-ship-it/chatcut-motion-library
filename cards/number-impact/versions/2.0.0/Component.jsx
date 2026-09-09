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
  const left = p.position === "left" ? 140 : p.position === "center" ? 960 : 1090;
  const progress = enter(0.03, 19);
  const centering = p.position === "center" ? "translateX(-50%) " : "";
  const numberStyle = { position: "absolute", left, top: 292, color: p.color, fontSize: p.fontSize, fontWeight: 900, lineHeight: 1, letterSpacing: -14, whiteSpace: "nowrap", opacity: fade(0.03, 0.06), transformOrigin: "center", transform: `${centering}translateY(${14 * (1 - progress)}px) scale(${0.78 + progress * 0.22})`, textShadow: "4px 6px 5px rgba(0,0,0,.6)" };

  const rootStyle = { position: "absolute", inset: 0, overflow: "hidden", backgroundColor: "transparent", fontFamily: p.fontFamily };
  return <div style={rootStyle}><div style={sceneStyle}>
<div style={numberStyle}>{p.prefix}{p.value}{p.suffix}</div>
  </div></div>;
};
