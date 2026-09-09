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
  const lines = [p.line1, p.line2, p.line3];
  const delays = [0.05, 1.35, 1.95];
  const listStyle = { position: "absolute", left: p.x, top: p.y, maxWidth: 600, display: "flex", flexDirection: "column", alignItems: "flex-start", fontWeight: 900, lineHeight: 1.1, textShadow: "3px 4px 3px rgba(0,0,0,.65)" };

  const rootStyle = { position: "absolute", inset: 0, overflow: "hidden", backgroundColor: "transparent", fontFamily: p.fontFamily };
  return <div style={rootStyle}><div style={sceneStyle}>
<div style={listStyle}>{lines.map((text, index) => {
    const style = { display: "flex", alignItems: "center", gap: 28, minHeight: 94, fontSize: index === 0 ? 82 : 76, color: index === 0 ? p.accentColor : p.secondaryColor, ...motion(delays[index], -24, 0, 0.98), transformOrigin: "left center" };
    const dotStyle = { width: 16, height: 16, flexShrink: 0, borderRadius: "50%", backgroundColor: p.dotColor };
    return text ? <div key={index} style={style}><span>{text}</span>{index === 0 && p.showDot ? <span style={dotStyle} /> : null}</div> : null;
  })}</div>
  </div></div>;
};
