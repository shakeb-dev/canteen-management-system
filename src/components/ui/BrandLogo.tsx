import React from 'react';
import logo from '../../assets/banswara_syntex_ltd__logo.png';
import { cn } from '../../utils/cn';

interface BrandLogoProps {
  className?: string;
  showText?: boolean;
  collapsed?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className, showText = true, collapsed = false }) => {
  return (
    <div className={cn("flex items-center gap-2.5 overflow-hidden", className)}>
      <div className={cn(
        "flex shrink-0 items-center justify-center  ",
        collapsed ? "h-10 w-10" : "h-20 w-20"
      )}>
        <img
          src={logo}
          alt="Banswara Syntex Ltd"
          className="h-full w-full object-contain"
        />
      </div>
      {showText && !collapsed && (
        <div className="flex flex-col min-w-0 animate-fade-in">

        </div>
      )}
    </div>
  );
};




