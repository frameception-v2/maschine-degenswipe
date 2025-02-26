"use client";

import { useEffect, useCallback, useState, FormEvent } from "react";
import sdk, {
  AddFrame,
  SignIn as SignInCore,
  type Context,
} from "@farcaster/frame-sdk";
import { toast } from "../components/ui/use-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";

import { config } from "~/components/providers/WagmiProvider";
import { truncateAddress } from "~/lib/truncateAddress";
import { base, optimism } from "wagmi/chains";
import { useSession } from "next-auth/react";
import { createStore } from "mipd";
import { Label } from "~/components/ui/label";
import { PROJECT_TITLE } from "~/lib/constants";

import { DEGEN_TIPS } from "~/lib/tips-data";

function TipsCard() {
  return (
    <Card className="bg-[#3B185F] text-white border-none">
      <CardHeader>
        <CardTitle>🎩 Today&apos;s Degen Wisdom</CardTitle>
        <CardDescription className="text-purple-200">
          Curated tips from the purple realm
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {DEGEN_TIPS.map((tip) => (
            <div key={tip.fid} className="border-l-2 border-purple-300 pl-3">
              <p className="text-sm font-semibold text-purple-200">@{tip.username}</p>
              <p className="text-white">{tip.tip}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Frame() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const [fid, setFid] = useState('');
  const [degenStats, setDegenStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDegenStats = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/degen-stats?fid=${fid}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch stats');
      }
      
      setDegenStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const [added, setAdded] = useState(false);

  const [addFrameResult, setAddFrameResult] = useState("");

  const addFrame = useCallback(async () => {
    try {
      await sdk.actions.addFrame();
    } catch (error) {
      if (error instanceof AddFrame.RejectedByUser) {
        setAddFrameResult(`Not added: ${error.message}`);
        toast({
          variant: "destructive",
          title: "🎩 Frame not added",
          description: error.message
        });
      } else if (error instanceof AddFrame.InvalidDomainManifest) {
        setAddFrameResult(`Not added: ${error.message}`);
        toast({
          variant: "destructive",
          title: "🎩 Invalid configuration",
          description: error.message
        });
      } else if (error instanceof Error) {
        setAddFrameResult(`Error: ${error.message}`);
        toast({
          variant: "destructive",
          title: "🎩 Temporary error",
          description: error.message,
          action: {
            label: 'Retry',
            onClick: () => addFrame()
          }
        });
      }
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      if (!context) {
        return;
      }

      setContext(context);
      setAdded(context.client.added);

      // If frame isn't already added, prompt user to add it
      if (!context.client.added) {
        addFrame();
      }

      sdk.on("frameAdded", ({ notificationDetails }) => {
        setAdded(true);
      });

      sdk.on("frameAddRejected", ({ reason }) => {
        console.log("frameAddRejected", reason);
      });

      sdk.on("frameRemoved", () => {
        console.log("frameRemoved");
        setAdded(false);
      });

      sdk.on("notificationsEnabled", ({ notificationDetails }) => {
        console.log("notificationsEnabled", notificationDetails);
      });
      sdk.on("notificationsDisabled", () => {
        console.log("notificationsDisabled");
      });

      sdk.on("primaryButtonClicked", () => {
        console.log("primaryButtonClicked");
      });

      console.log("Calling ready");
      sdk.actions.ready({});

      // Set up a MIPD Store, and request Providers.
      const store = createStore();

      // Subscribe to the MIPD Store.
      store.subscribe((providerDetails) => {
        console.log("PROVIDER DETAILS", providerDetails);
        // => [EIP6963ProviderDetail, EIP6963ProviderDetail, ...]
      });
    };
    if (sdk && !isSDKLoaded) {
      console.log("Calling load");
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded, addFrame]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="w-[300px] mx-auto py-2 px-2" style={{backgroundColor: "#2A0944"}}>
        <h1 className="text-2xl font-bold text-center mb-4 text-white">
          {PROJECT_TITLE}
        </h1>

        <form onSubmit={fetchDegenStats} className="mb-4">
          <div className="flex gap-2">
            <input
              type="number"
              value={fid}
              onChange={(e) => setFid(e.target.value)}
              placeholder="Enter FID"
              className="flex-1 px-3 py-2 rounded bg-[#3B185F] text-white border border-purple-300 placeholder-purple-200"
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
              disabled={loading || !fid}
            >
              {loading ? '...' : 'Look up'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-white">
            {error}
          </div>
        )}

        {degenStats && (
          <Card className="mb-4 bg-[#3B185F] text-white border-none">
            <CardHeader>
              <CardTitle>🎩 Degen Stats</CardTitle>
              <CardDescription className="text-purple-200">
                Points and allowances for FID {fid}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {degenStats.season1 && (
                  <div>
                    <h3 className="font-semibold mb-1">Season 1 Points</h3>
                    <p className="text-2xl text-purple-200">{degenStats.season1.points}</p>
                  </div>
                )}
                {degenStats.season2 && (
                  <div>
                    <h3 className="font-semibold mb-1">Season 2 Points</h3>
                    <p className="text-2xl text-purple-200">{degenStats.season2.points}</p>
                  </div>
                )}
                {degenStats.allowances && (
                  <div>
                    <h3 className="font-semibold mb-1">Current Allowance</h3>
                    <p className="text-2xl text-purple-200">
                      {degenStats.allowances.remaining_tip_allowance} / {degenStats.allowances.tip_allowance}
                    </p>
                    <p className="text-sm text-purple-300">Rank: #{degenStats.allowances.user_rank}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <TipsCard />
      </div>
    </div>
  );
}
