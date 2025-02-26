export interface DegenTip {
  fid: number;
  username: string;
  tip: string;
  timestamp: string;
}

export const DEGEN_TIPS: DegenTip[] = [
  {
    fid: 1,
    username: "degen.eth",
    tip: "🎩 Always DYOR before aping into new protocols",
    timestamp: "2025-02-26"
  },
  {
    fid: 2,
    username: "purple.eth",
    tip: "🎩 Set stop losses to protect your gains fam",
    timestamp: "2025-02-26"
  },
  {
    fid: 3,
    username: "vibes.eth",
    tip: "🎩 Community > Everything. Build relationships!",
    timestamp: "2025-02-26"
  },
  {
    fid: 4,
    username: "gmi.eth",
    tip: "🎩 Stay hydrated during those long trading sessions",
    timestamp: "2025-02-26"
  },
  {
    fid: 5,
    username: "wagmi.eth",
    tip: "🎩 Don't forget to touch grass between trades",
    timestamp: "2025-02-26"
  }
];
