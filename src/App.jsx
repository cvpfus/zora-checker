import { useState } from "react";
import { createConfig, http, useReadContract, WagmiProvider } from "wagmi";
import { base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Configure wagmi client
const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
});

// Zora Token Community Claim ABI
const zoraAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "accountClaim",
    outputs: [
      {
        components: [
          {
            internalType: "uint96",
            name: "allocation",
            type: "uint96",
          },
          {
            internalType: "bool",
            name: "claimed",
            type: "bool",
          },
        ],
        internalType: "struct IZoraTokenCommunityClaim.AccountClaim",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const CONTRACT_ADDRESS = "0x0000000002ba96c69b95e32caab8fc38bab8b3f8";

function AirdropChecker() {
  const [inputAddress, setInputAddress] = useState("");
  const [checkingAddress, setCheckingAddress] = useState("");
  const [showAds, setShowAds] = useState(true);

  // Read contract data
  const { data, isError, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: zoraAbi,
    functionName: "accountClaim",
    args: [checkingAddress.toLowerCase()],
    query: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: Boolean(checkingAddress),
    },
  });

  console.log(!!checkingAddress);

  const handleCheckAirdrop = () => {
    if (inputAddress) {
      setCheckingAddress(inputAddress);
      refetch();
    }
  };

  const formatEth = (value) => {
    if (!value) return "0";
    return (Number(value) / 10 ** 18).toFixed(4);
  };

  return (
    <div className="min-h-screen w-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 md:p-48">
      <div className="w-full bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-purple-400 mb-2">
            Zora Unofficial Airdrop Checker
          </h1>
          <p className="text-gray-400">
            Check if you're eligible for the Zora token airdrop. No need to
            connect your wallet.
          </p>
          <p className="text-gray-400">
            Note: This checker is fetching the data from this{" "}
            <a
              href="https://basescan.org/address/0x0000000002ba96c69b95e32caab8fc38bab8b3f8"
              className="underline cursor-pointer"
              target="_blank"
            >
              contract
            </a>{" "}
            and it might be a fake contract. This site is just a tool to check
            an address using that contract.
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400 block">
              Enter your address:
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="0x..."
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
                className="flex-1 bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleCheckAirdrop}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                Check
              </button>
            </div>
          </div>

          {isLoading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500 border-r-2 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-400">
                Checking eligibility...
              </p>
            </div>
          )}

          {isError && (
            <div className="bg-red-900/30 border border-red-800 rounded-md p-3 text-sm">
              <p>Error checking eligibility. Please try again.</p>
            </div>
          )}

          {data && (
            <div className="bg-gray-700 rounded-md p-4 space-y-3">
              <h3 className="text-lg font-medium">Airdrop Status</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-400">Address:</div>
                <div className="font-mono truncate">{checkingAddress}</div>

                <div className="text-gray-400">Allocation:</div>
                <div className="font-medium">
                  {data?.allocation ? formatEth(data.allocation) : "0"} ZORA
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-12">
            <button
              className="bg-gray-700 hover:bg-gray-600 border border-gray-500 rounded px-1 py-0.5 text-[10px] font-medium transition-colors min-h-0 min-w-0 h-5 leading-none"
              style={{ borderRadius: "4px", padding: "2px 6px" }}
              onClick={() => setShowAds((prev) => !prev)}
            >
              {showAds ? "Hide Ads :(" : "Show Ads"}
            </button>
          </div>

          {showAds && (
            <>
              <div className="w-full bg-yellow-100/10 border border-yellow-400 rounded-md p-4 my-4 flex flex-col items-center">
                <span className="text-yellow-300 font-semibold text-base mb-1">
                  Ad #1
                </span>
                <a
                  href="https://edustreamr.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-yellow-200/10 hover:bg-yellow-200/20 border border-yellow-400 rounded-md px-4 py-3 mt-2 transition-colors shadow-lg"
                >
                  <span className="text-yellow-100 font-bold text-lg block mb-1">
                    EduStreamr
                  </span>
                  <span className="text-yellow-200 text-sm block mb-1">
                    <div>
                      A decentralized tipping platform for streamers that offers
                      instant payouts and super low fees, all powered by
                      blockchain. Currently live on the{" "}
                      <b>EDU Chain Testnet.</b>
                    </div>
                    <div>
                      EduStreamr is currently participating in the{" "}
                      <b>Open Campus Incubator</b>. We are looking for beta
                      testers to try our platform and give us feedback.
                    </div>
                  </span>
                  <span className="text-yellow-300 underline text-xs">
                    edustreamr.xyz
                  </span>
                </a>
              </div>

              <div className="w-full bg-orange-100/10 border border-orange-400 rounded-md p-4 my-6 flex flex-col items-center">
                <span className="text-orange-300 font-semibold text-base mb-1">
                  Ad #2
                </span>
                <a
                  href="https://www.producthunt.com/products/edustreamr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-orange-200/10 hover:bg-orange-200/20 border border-orange-400 rounded-md px-4 py-3 mt-2 transition-colors shadow-lg"
                >
                  <span className="text-orange-100 font-bold text-lg block mb-1">
                    EduStreamr is launching soon on Product Hunt!
                  </span>
                  <span className="text-orange-200 text-sm block mb-1">
                    <div>
                      Support us by visiting our Product Hunt page and hitting
                      the <b>Notify Me</b> button so you don't miss the launch!
                    </div>
                  </span>
                  <span className="text-orange-300 underline text-xs">
                    producthunt.com/products/edustreamr
                  </span>
                </a>
              </div>
            </>
          )}

          <footer className="w-full text-center mt-8 text-sm text-gray-500">
            <a
              href="https://x.com/cvpfus_id"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 underline transition-colors"
            >
              Created by @cvpfus_id
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
}

function App() {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AirdropChecker />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
