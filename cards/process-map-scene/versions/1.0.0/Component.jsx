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
  const nodes = [[p.text1,830,328,0.05],[p.text2,425,548,0.45],[p.text3,830,548,1.2],[p.text4,1240,548,0.85],[p.text5,830,762,1.6]];
  const titleStyle = { position:"absolute",left:400,top:132,width:1120,textAlign:"center",fontSize:80,fontWeight:900,color:"#fff",...motion(2.9,0,10,0.98) };

  const rootStyle = { position: "absolute", inset: 0, overflow: "hidden", backgroundColor: "#000", fontFamily: p.fontFamily };
  return <div style={rootStyle}><div style={sceneStyle}>
{grid}
{p.title ? <div style={titleStyle}>{p.title}</div> : null}
  {nodes.map((node,index) => {
    const [text,left,top,delay] = node;
    const style = { position:"absolute",left,top,width:260,minHeight:142,boxSizing:"border-box",padding:"12px 18px",borderRadius:27,border:"4px solid #9C86DA",backgroundColor:p.nodeColor,color:p.textColor,fontSize:88,fontWeight:700,lineHeight:1.2,display:"flex",alignItems:"center",justifyContent:"center",...motion(delay,0,14,0.9) };
    return <div key={index} style={style}>{text}</div>;
  })}
  </div></div>;
};
