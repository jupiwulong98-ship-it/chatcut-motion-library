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
  // A ceiling and floor recede into a dark central space; horizontal lines are essential.
  const gridLines = [];
  for (let x = -120; x <= 2040; x += 114) {
    const path = `M ${x} 0 L 960 540 L ${x} 1080`;
    gridLines.push(<path key={`ray-${x}`} d={path} />);
  }
  const rows = [48, 105, 152, 198, 242, 284, 321, 742, 780, 825, 876, 933, 998, 1060];
  rows.forEach((y) => { gridLines.push(<path key={`row-${y}`} d={`M 0 ${y} H 1920`} />); });
  const gridStyle = { position: "absolute", inset: 0, opacity: fade(0, 0.16) };
  const shadeStyle = { position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 0%,rgba(0,0,0,.88) 29%,#000 42%,#000 60%,rgba(0,0,0,.65) 74%,transparent 100%)" };
  const grid = <div style={gridStyle}><svg width="1920" height="1080" viewBox="0 0 1920 1080"><g stroke={p.gridColor} strokeWidth="4" fill="none">{gridLines}</g></svg><div style={shadeStyle} /></div>;
  const source = p.resultVideo || p.resultImage;
  const Result = p.resultVideo ? Video : Img;
  const progress = enter(0.18,26);
  const presenterStyle = { position:"absolute",left:0,top:140,width:805,height:820,overflow:"hidden",...motion(0.03,-25,0,0.98) };
  const resultStyle = { position:"absolute",left:810,top:190,width:1050,height:760,overflow:"hidden",transformOrigin:"center",opacity:fade(0.18,0.14),transform:`perspective(1700px) rotateY(-24deg) rotateZ(-4deg) translateX(${80*(1-progress)}px) scale(${0.94+0.06*progress})` };

  const rootStyle = { position: "absolute", inset: 0, overflow: "hidden", backgroundColor: "#000" };
  return <div style={rootStyle}><div style={sceneStyle}>
{grid}
<div style={presenterStyle}>{p.presenterVideo ? <Video src={p.presenterVideo} muted style={mediaStyle} /> : null}</div>
  <div style={resultStyle}>{source ? <Result src={source} muted style={mediaStyle} /> : null}</div>
  </div></div>;
};
