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
  const source = p.brollVideo || p.brollImage;
  const Background = p.brollVideo ? Video : Img;

  const rootStyle = { position: "absolute", inset: 0, overflow: "hidden", backgroundColor: "#000" };
  return <div style={rootStyle}><div style={sceneStyle}>
{source ? <Background src={source} muted style={mediaStyle} /> : null}
<div style={{ position: "absolute", left: 84, top: 700, width: 344, height: 344, borderRadius: "50%", overflow: "hidden", clipPath: "circle(50%)", boxSizing: "border-box", border: "4px solid #8FD5E5", ...motion(0.22, -35, 12, 0.9) }}>{p.presenterVideo ? <Video src={p.presenterVideo} muted style={mediaStyle} /> : null}</div>
  </div></div>;
};
