import React, { useState } from "react";
import Sharing from "@/src/assets/images/Sharing";

export default function ShareButton({onShare, VideoId}) {

  
  return (
    <>
      <button className="bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition-colors flex flex-col items-center gap-1 text-white"
      onClick={() => onShare(VideoId)}>
        <Sharing />
      </button>

      
    </>
  );
}
