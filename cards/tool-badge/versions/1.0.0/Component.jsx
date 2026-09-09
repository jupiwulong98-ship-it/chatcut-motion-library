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
  const logos = [[p.logoLeft,270,392,270,0.04],[p.logoRight,1390,400,280,0.48]];

  const rootStyle = { position: "absolute", inset: 0, overflow: "hidden", backgroundColor: "transparent" };
  return <div style={rootStyle}><div style={sceneStyle}>
{logos.map((logo, index) => {
    const [source,left,top,size,delay] = logo;
    if (!source) return null;
    const style = { position: "absolute", left, top, width:size, height:size, ...motion(delay, index === 0 ? -28 : 28, 0, 0.75) };
    return <div key={index} style={style}><Img src={source} style={containStyle} /></div>;
  })}
  </div></div>;
};
