import React from 'react';

export const EthIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 12l6-9 6 9-6 9-6-9z" />
    <path d="M6 12l6 9 6-9" />
    <path d="M6 12h12" />
  </svg>
);


export const UsdcIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M16 8.42A4.5 4.5 0 0012 6a4.5 4.5 0 00-4 3.42" />
    <path d="M8 15.58A4.5 4.5 0 0012 18a4.5 4.5 0 004-2.58" />
    <path d="M14 12h-4" />
  </svg>
);

export const WbtcIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M10.5 7.5h3a2 2 0 012 2v1" />
    <path d="M10.5 13.5h3a2 2 0 002-2v-1" />
    <path d="M8.5 7.5h-1" />
    <path d="M8.5 13.5h-1" />
    <path d="M10.5 7.5V6" />
    <path d="M10.5 13.5v1.5" />
    <path d="M13.5 7.5V6" />
    <path d="M13.5 13.5v1.5" />
    <path d="M8.5 12h2" />
    <path d="M13.5 12h2" />
  </svg>
);

export const LdoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );

export const MetaMaskIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.6 14.03C20.87 13.39 21 12.7 21 12C21 7.03 16.97 3 12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C12.56 21 13.1 20.93 13.62 20.82" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.5 16.5C10.5 16.5 12.5 15 14 15C15.5 15 16.5 16 16.5 17.5C16.5 17.5 18 18 18.5 17C19 16 18 14.5 18 14.5C18 14.5 16.5 12.5 15 12.5C13.5 12.5 11 14 11 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9.5 12C9.5 11.45 9.95 11 10.5 11C11.05 11 11.5 11.45 11.5 12C11.5 12.55 11.05 13 10.5 13C9.95 13 9.5 12.55 9.5 12Z" fill="currentColor"/>
        <path d="M15.5 10C15.5 9.45 15.95 9 16.5 9C17.05 9 17.5 9.45 17.5 10C17.5 10.55 17.05 11 16.5 11C15.95 11 15.5 10.55 15.5 10Z" fill="currentColor"/>
    </svg>
);

export const WalletConnectIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.26,13.63a3.25,3.25,0,0,1,0-3.26L5.6,9.13a.5.5,0,0,0,0-.88L4.26,7A3.25,3.25,0,0,1,6.5,3.5H7A3.25,3.25,0,0,1,10.29,4.9l1.34,2.32a.5.5,0,0,0,.86,0L13.83,4.9A3.25,3.25,0,0,1,17,3.5h.5a3.25,3.25,0,0,1,2.24,5.87l-1.34,1.24a.5.5,0,0,0,0,.88l1.34,1.24A3.25,3.25,0,0,1,17,20.5H16.5a3.25,3.25,0,0,1-3.29-1.4L11.87,16.8a.5.5,0,0,0-.86,0l-1.34,2.3A3.25,3.25,0,0,1,6.5,20.5H6A3.25,3.25,0,0,1,4.26,13.63Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const TokenIcons: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  eth: EthIcon,
  usdc: UsdcIcon,
  wbtc: WbtcIcon,
  ldo: LdoIcon,
  metamask: MetaMaskIcon,
  walletconnect: WalletConnectIcon
};
