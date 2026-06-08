const SocialLoginIcons = () => {
  const handleGoogleLogin = () => {
    window.location.href = `/api/auth/login/google`;
  };

  return (
    <ul className="my-4 flex h-[70px] w-full list-none justify-center gap-4 font-['Poppins']">
      {/* Google/Gmail */}
      <li
        className="group relative m-2.5 flex h-[50px] w-[50px] cursor-pointer flex-col items-center justify-center rounded-full bg-white text-[18px] shadow-[0_10px_10px_rgba(0,0,0,0.1)] transition-all duration-200 [transition-timing-function:cubic-bezier(0.68,-0.55,0.265,1.55)] hover:bg-[#ea4335] hover:text-white hover:[text-shadow:0_-1px_0_rgba(0,0,0,0.1)]"
        onClick={handleGoogleLogin}
      >
        <span className="pointer-events-none absolute top-0 rounded-[5px] bg-white px-[8px] py-[5px] text-[14px] text-white opacity-0 shadow-[0_10px_10px_rgba(0,0,0,0.1)] transition-all duration-300 [transition-timing-function:cubic-bezier(0.68,-0.55,0.265,1.55)] group-hover:pointer-events-auto group-hover:-top-[45px] group-hover:bg-[#ea4335] group-hover:text-white group-hover:opacity-100 group-hover:[text-shadow:0_-1px_0_rgba(0,0,0,0.1)] before:absolute before:-bottom-[3px] before:left-1/2 before:h-2 before:w-2 before:-translate-x-1/2 before:rotate-45 before:bg-white before:transition-all before:duration-300 before:[transition-timing-function:cubic-bezier(0.68,-0.55,0.265,1.55)] before:content-[''] group-hover:before:bg-[#ea4335]">
          Google
        </span>
        <i className="fab fa-google text-lg"></i>
      </li>

      {/* Apple */}
      <li className="group relative m-2.5 flex h-[50px] w-[50px] cursor-pointer flex-col items-center justify-center rounded-full bg-white text-[18px] shadow-[0_10px_10px_rgba(0,0,0,0.1)] transition-all duration-200 [transition-timing-function:cubic-bezier(0.68,-0.55,0.265,1.55)] hover:bg-black hover:text-white hover:[text-shadow:0_-1px_0_rgba(0,0,0,0.1)]">
        <span className="pointer-events-none absolute top-0 rounded-[5px] bg-white px-[8px] py-[5px] text-[14px] text-white opacity-0 shadow-[0_10px_10px_rgba(0,0,0,0.1)] transition-all duration-300 [transition-timing-function:cubic-bezier(0.68,-0.55,0.265,1.55)] group-hover:pointer-events-auto group-hover:-top-[45px] group-hover:bg-black group-hover:text-white group-hover:opacity-100 group-hover:[text-shadow:0_-1px_0_rgba(0,0,0,0.1)] before:absolute before:-bottom-[3px] before:left-1/2 before:h-2 before:w-2 before:-translate-x-1/2 before:rotate-45 before:bg-white before:transition-all before:duration-300 before:[transition-timing-function:cubic-bezier(0.68,-0.55,0.265,1.55)] before:content-[''] group-hover:before:bg-black">
          Apple
        </span>
        <i className="fab fa-apple text-lg"></i>
      </li>

      {/* Facebook */}
      <li className="group relative m-2.5 flex h-[50px] w-[50px] cursor-pointer flex-col items-center justify-center rounded-full bg-white text-[18px] shadow-[0_10px_10px_rgba(0,0,0,0.1)] transition-all duration-200 [transition-timing-function:cubic-bezier(0.68,-0.55,0.265,1.55)] hover:bg-[#1877f2] hover:text-white hover:[text-shadow:0_-1px_0_rgba(0,0,0,0.1)]">
        <span className="pointer-events-none absolute top-0 rounded-[5px] bg-white px-[8px] py-[5px] text-[14px] text-white opacity-0 shadow-[0_10px_10px_rgba(0,0,0,0.1)] transition-all duration-300 [transition-timing-function:cubic-bezier(0.68,-0.55,0.265,1.55)] group-hover:pointer-events-auto group-hover:-top-[45px] group-hover:bg-[#1877f2] group-hover:text-white group-hover:opacity-100 group-hover:[text-shadow:0_-1px_0_rgba(0,0,0,0.1)] before:absolute before:-bottom-[3px] before:left-1/2 before:h-2 before:w-2 before:-translate-x-1/2 before:rotate-45 before:bg-white before:transition-all before:duration-300 before:[transition-timing-function:cubic-bezier(0.68,-0.55,0.265,1.55)] before:content-[''] group-hover:before:bg-[#1877f2]">
          Facebook
        </span>
        <i className="fab fa-facebook-f text-lg"></i>
      </li>
    </ul>
  );
};

export default SocialLoginIcons;
