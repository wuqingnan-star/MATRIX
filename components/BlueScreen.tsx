import React from 'react';

export const BlueScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#0000AA] text-white font-mono p-10 z-50 overflow-hidden flex flex-col justify-start items-start select-none">
      <h1 className="text-2xl mb-8 bg-[#AAAAAA] text-[#0000AA] inline-block px-1">Windows</h1>
      <p className="mb-4">A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36. The current application will be terminated.</p>
      
      <p className="mb-4">* Press any key to terminate the current application.</p>
      <p className="mb-4">* Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</p>
      
      <p className="mt-8 text-center w-full">Press any key to continue _</p>

      <div className="absolute bottom-10 left-10 text-sm opacity-50">
        Stop: 0x0000000A (0x00000000, 0x00000002, 0x00000000, 0x80388204)
      </div>
    </div>
  );
};