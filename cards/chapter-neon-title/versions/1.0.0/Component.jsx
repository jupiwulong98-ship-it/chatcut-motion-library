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
  const source = p.backgroundVideo || p.backgroundImage;
  const Background = p.backgroundVideo ? Video : Img;
  const progress = enter(0.06, 26);
  const titleStyle = { position: "absolute", left: 150, top: 286, width: 1620, textAlign: "center", fontSize: Math.min(p.fontSize, 1550 / Math.max(Array.from(p.title).length - 0.6, 1)), fontWeight: 900, letterSpacing: 14, lineHeight: 1.12, whiteSpace: "nowrap", color: "transparent", WebkitTextStroke: `${p.strokeWidth}px ${p.neonColor}`, textShadow: `0 0 8px ${p.neonColor}, 0 0 28px ${p.neonColor}`, opacity: fade(0.06, 0.13), transform: `scale(${0.94 + progress * 0.06})` };

  const rootStyle = { position: "absolute", inset: 0, overflow: "hidden", backgroundColor: "#000", fontFamily: p.fontFamily };
  return <div style={rootStyle}><div style={sceneStyle}>
{source ? <Background src={source} muted style={mediaStyle} /> : null}
  <div style={titleStyle}>{p.title}</div>
  </div></div>;
};
