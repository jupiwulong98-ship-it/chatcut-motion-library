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
  const labels = [p.label1,p.label2,p.label3,p.label4,p.label5];
  const positions = [[205,350,0.05],[205,555,0.35],[1290,205,0.65],[1298,400,1.0],[1510,592,1.45]];

  const rootStyle = { position: "absolute", inset: 0, overflow: "hidden", backgroundColor: "transparent", fontFamily: p.fontFamily };
  return <div style={rootStyle}><div style={sceneStyle}>
{labels.map((text, index) => {
    if (!text) return null;
    const [left, top, delay] = positions[index];
    const style = { position: "absolute", left, top, minWidth: 420, maxWidth: 520, minHeight: 178, boxSizing: "border-box", padding: "24px 34px", borderRadius: 48, backgroundColor: p.fillColor, color: p.textColor, fontSize: 78, fontWeight: 900, lineHeight: 1.25, textAlign: "center", overflowWrap: "anywhere", ...motion(delay, index < 2 ? -90 : 90, 0, 0.94) };
    return <div key={index} style={style}>{text}</div>;
  })}
  </div></div>;
};
