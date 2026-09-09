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
  const presenterStyle = { position:"absolute", left:578,top:78,width:768,height:766,borderRadius:70,overflow:"hidden",border:"5px solid #fff",boxSizing:"border-box",...motion(0.04,0,22) };
  const cards = [[p.label1,120,225,0.25],[p.label2,120,590,0.65],[p.label3,1395,132,0.95],[p.label4,1388,416,1.25],[p.label5,1382,710,1.55]];

  const rootStyle = { position: "absolute", inset: 0, overflow: "hidden", backgroundColor: "#000", fontFamily: p.fontFamily };
  return <div style={rootStyle}><div style={sceneStyle}>
{grid}
<div style={presenterStyle}>{p.presenterVideo ? <Video src={p.presenterVideo} muted style={mediaStyle} /> : null}</div>
  {cards.map((card,index) => {
    const [text,left,top,delay] = card;
    const style = { position: "absolute", left, top, width: 430, height: 248, boxSizing: "border-box", borderRadius: 46, border: "5px solid #fff", background: "linear-gradient(100deg,#56E5C7,#1AA4E6)", boxShadow: "7px 9px 0 #105666", display: "flex", alignItems: "center", justifyContent: "center", ...motion(delay,index < 2 ? -50 : 50,0,0.9) };
    const innerStyle = { position:"absolute", inset:12, border:"3px dashed rgba(255,255,255,.9)", borderRadius:34 };
    const textStyle = { fontSize: Math.min(94, 350 / Math.max(Array.from(text).length - 0.65, 1)), fontWeight:900, color:p.textColor, WebkitTextStroke:"2px #12667B", textShadow:"5px 7px 0 #12667B", whiteSpace:"nowrap" };
    return <div key={index} style={style}><div style={innerStyle}/><span style={textStyle}>{text}</span></div>;
  })}
  </div></div>;
};
