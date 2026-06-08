function Loader() {
  return (
    <div className="animate-spinner-cube relative h-11 w-11 [transform-style:preserve-3d]">
      <div className="absolute h-full w-full [transform:translateZ(-22px)_rotateY(180deg)] border-2 border-[#004dff] bg-[#004dff]/20"></div>
      <div className="absolute h-full w-full [transform-origin:top_right] [transform:rotateY(-270deg)_translateX(50%)] border-2 border-[#004dff] bg-[#004dff]/20"></div>
      <div className="absolute h-full w-full [transform-origin:center_left] [transform:rotateY(270deg)_translateX(-50%)] border-2 border-[#004dff] bg-[#004dff]/20"></div>
      <div className="absolute h-full w-full [transform-origin:top_center] [transform:rotateX(90deg)_translateY(-50%)] border-2 border-[#004dff] bg-[#004dff]/20"></div>
      <div className="absolute h-full w-full [transform-origin:bottom_center] [transform:rotateX(-90deg)_translateY(50%)] border-2 border-[#004dff] bg-[#004dff]/20"></div>
      <div className="absolute h-full w-full [transform:translateZ(22px)] border-2 border-[#004dff] bg-[#004dff]/20"></div>
    </div>
  );
}

export default Loader;
