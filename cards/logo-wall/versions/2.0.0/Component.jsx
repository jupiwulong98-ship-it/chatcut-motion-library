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
  const logos = [p.logo1,p.logo2,p.logo3,p.logo4,p.logo5,p.logo6,p.logo7,p.logo8];
  const positions = [[42,505,195],[265,495,225],[525,510,245],[1310,525,315],[1680,555,220],[42,747,220],[280,765,300],[1370,830,425]];

  const rootStyle = { position: "absolute", inset: 0, overflow: "hidden", backgroundColor: "transparent" };
  return <div style={rootStyle}><div style={sceneStyle}>
{logos.map((source, index) => {
    if (!source) return null;
    const [left, top, size] = positions[index];
    const delay = index * 0.045;
    const style = { position: "absolute", left, top, width: size, height: size, ...motion(delay, 0, 12, 0.94), opacity: p.opacity * fade(delay) };
    return <div key={index} style={style}><Img src={source} style={containStyle} /></div>;
  })}
  </div></div>;
};
