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
            Check if you're eligible for the Zora token airdrop. No need to connect your wallet.
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
