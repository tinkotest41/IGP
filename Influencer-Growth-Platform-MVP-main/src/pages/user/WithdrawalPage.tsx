import React, { useState } from "react";
import { UserLayout } from "../../components/layout/UserLayout";
import { useAuth } from "../../contexts/AuthContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import { useDataStore } from "../../contexts/DataStore";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { formatCurrency } from "../../lib/utils";
import {
  AlertCircle,
  CheckCircle,
  Wallet,
  Bitcoin,
  Building2,
  Phone,
  Clock,
  Check,
  X,
} from "lucide-react";

type WithdrawalMethod = "bank" | "crypto" | "mobile_money";

interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
  routingNumber: string;
}

interface CryptoDetails {
  network: string;
  walletAddress: string;
}

interface MobileMoneyDetails {
  provider: string;
  phoneNumber: string;
  accountName: string;
}

export function WithdrawalPage() {
  const { user, refreshUser } = useAuth();
  const { currency } = useCurrency();
  const { addWithdrawal, withdrawals } = useDataStore();

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<WithdrawalMethod>("bank");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [bankDetails, setBankDetails] = useState<BankDetails>({
    bankName: "",
    accountNumber: "",
    accountName: "",
    routingNumber: "",
  });

  const [cryptoDetails, setCryptoDetails] = useState<CryptoDetails>({
    network: "USDT (TRC20)",
    walletAddress: "",
  });

  const [mobileDetails, setMobileDetails] = useState<MobileMoneyDetails>({
    provider: "",
    phoneNumber: "",
    accountName: "",
  });

  if (!user) return null;

  const userWithdrawals = withdrawals.filter((w) => w.userId === user.id);

  const minWithdrawal = 15;
  const minReferrals = 5;
  const canWithdraw =
    user.totalBalance >= minWithdrawal && user.referralCount >= minReferrals;

  const getDetailsString = () => {
    switch (method) {
      case "bank":
        return `Bank: ${bankDetails.bankName}, Account: ${bankDetails.accountNumber}, Name: ${bankDetails.accountName}${bankDetails.routingNumber ? `, Routing: ${bankDetails.routingNumber}` : ""}`;
      case "crypto":
        return `${cryptoDetails.network}: ${cryptoDetails.walletAddress}`;
      case "mobile_money":
        return `${mobileDetails.provider}: ${mobileDetails.phoneNumber} (${mobileDetails.accountName})`;
      default:
        return "";
    }
  };

  const isFormValid = () => {
    if (
      !amount ||
      parseFloat(amount) < minWithdrawal ||
      parseFloat(amount) > user.totalBalance
    )
      return false;

    switch (method) {
      case "bank":
        return (
          bankDetails.bankName &&
          bankDetails.accountNumber &&
          bankDetails.accountName
        );
      case "crypto":
        return cryptoDetails.walletAddress;
      case "mobile_money":
        return (
          mobileDetails.provider &&
          mobileDetails.phoneNumber &&
          mobileDetails.accountName
        );
      default:
        return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    addWithdrawal({
      id: `WD-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      amount: parseFloat(amount),
      method,
      details: getDetailsString(),
      status: "pending",
      requestDate: new Date().toISOString().split("T")[0],
    });

    refreshUser();
    setIsSubmitting(false);
    setSuccess(true);
    setAmount("");
  };

  const resetForm = () => {
    setSuccess(false);
    setAmount("");
    setBankDetails({
      bankName: "",
      accountNumber: "",
      accountName: "",
      routingNumber: "",
    });
    setCryptoDetails({ network: "USDT (TRC20)", walletAddress: "" });
    setMobileDetails({ provider: "", phoneNumber: "", accountName: "" });
  };

  const cryptoNetworks = [
    "USDT (TRC20)",
    "USDT (ERC20)",
    "USDT (BEP20)",
    "Bitcoin (BTC)",
    "Ethereum (ETH)",
    "BNB (BEP20)",
    "Litecoin (LTC)",
  ];

  const mobileProviders = [
    "M-Pesa",
    "Airtel Money",
    "MTN Mobile Money",
    "Orange Money",
    "Opay",
    "Palmpay",
    "Moov Money",
  ];

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white font-cyber">Withdraw Funds</h1>
            <p className="text-zinc-400">
              Request a payout to your preferred payment method.
            </p>
          </div>
          <Card className="bg-gradient-to-r from-emerald-500/10 to-transparent border-emerald-500/20 px-6 py-4">
            <p className="text-sm text-zinc-400">Available Balance</p>
            <p className="text-2xl font-bold text-emerald-500">
              {formatCurrency(user.totalBalance, currency.code, currency.rate)}
            </p>
          </Card>
        </div>

        {!canWithdraw && (
          <Card className="bg-red-500/10 border-red-500/20">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-red-400 mb-2">
                  Withdrawal Requirements Not Met
                </p>
                <ul className="space-y-1">
                  <li
                    className={`flex items-center gap-2 ${user.totalBalance >= minWithdrawal ? "text-emerald-500" : "text-red-400"}`}
                  >
                    {user.totalBalance >= minWithdrawal ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    Minimum balance: $15.00 (Current: $
                    {user.totalBalance.toFixed(2)})
                  </li>
                  <li
                    className={`flex items-center gap-2 ${user.referralCount >= minReferrals ? "text-emerald-500" : "text-red-400"}`}
                  >
                    {user.referralCount >= minReferrals ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    Minimum referrals: 5 (Current: {user.referralCount})
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              {success ? (
                <div className="text-center py-8">
                  <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Request Submitted
                  </h3>
                  <p className="text-zinc-400 mb-6">
                    Your withdrawal request is being processed. You'll receive
                    your funds within 24-48 hours.
                  </p>
                  <Button onClick={resetForm}>Make Another Request</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-zinc-400 mb-3 block">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        {
                          id: "bank",
                          label: "Bank Transfer",
                          icon: <Building2 className="w-5 h-5" />,
                        },
                        {
                          id: "crypto",
                          label: "Cryptocurrency",
                          icon: <Bitcoin className="w-5 h-5" />,
                        },
                        {
                          id: "mobile_money",
                          label: "Mobile Money",
                          icon: <Phone className="w-5 h-5" />,
                        },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setMethod(m.id as WithdrawalMethod)}
                          disabled={!canWithdraw}
                          className={`p-4 rounded-lg border transition-all flex flex-col items-center gap-2 ${
                            method === m.id
                              ? "bg-amber-500/10 border-amber-500 text-amber-500"
                              : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                          } ${!canWithdraw ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {m.icon}
                          <span className="text-xs font-medium">{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Input
                    label="Amount to Withdraw ($)"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min={minWithdrawal}
                    max={user.totalBalance}
                    disabled={!canWithdraw}
                    required
                    icon={<Wallet className="w-4 h-4" />}
                  />

                  {method === "bank" && (
                    <div className="space-y-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                      <h4 className="font-medium text-white flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-amber-500" />
                        Bank Account Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Bank Name"
                          placeholder="e.g. First Bank"
                          value={bankDetails.bankName}
                          onChange={(e) =>
                            setBankDetails({
                              ...bankDetails,
                              bankName: e.target.value,
                            })
                          }
                          disabled={!canWithdraw}
                          required
                        />
                        <Input
                          label="Account Number"
                          placeholder="e.g. 1234567890"
                          value={bankDetails.accountNumber}
                          onChange={(e) =>
                            setBankDetails({
                              ...bankDetails,
                              accountNumber: e.target.value,
                            })
                          }
                          disabled={!canWithdraw}
                          required
                        />
                        <Input
                          label="Account Name"
                          placeholder="e.g. John Doe"
                          value={bankDetails.accountName}
                          onChange={(e) =>
                            setBankDetails({
                              ...bankDetails,
                              accountName: e.target.value,
                            })
                          }
                          disabled={!canWithdraw}
                          required
                        />
                        <Input
                          label="Routing Number (Optional)"
                          placeholder="e.g. 123456789"
                          value={bankDetails.routingNumber}
                          onChange={(e) =>
                            setBankDetails({
                              ...bankDetails,
                              routingNumber: e.target.value,
                            })
                          }
                          disabled={!canWithdraw}
                        />
                      </div>
                    </div>
                  )}

                  {method === "crypto" && (
                    <div className="space-y-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                      <h4 className="font-medium text-white flex items-center gap-2">
                        <Bitcoin className="w-4 h-4 text-amber-500" />
                        Cryptocurrency Wallet
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-zinc-400 mb-2 block">
                            Network / Currency
                          </label>
                          <select
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                            value={cryptoDetails.network}
                            onChange={(e) =>
                              setCryptoDetails({
                                ...cryptoDetails,
                                network: e.target.value,
                              })
                            }
                            disabled={!canWithdraw}
                          >
                            {cryptoNetworks.map((network) => (
                              <option key={network} value={network}>
                                {network}
                              </option>
                            ))}
                          </select>
                        </div>
                        <Input
                          label="Wallet Address"
                          placeholder="Enter your wallet address"
                          value={cryptoDetails.walletAddress}
                          onChange={(e) =>
                            setCryptoDetails({
                              ...cryptoDetails,
                              walletAddress: e.target.value,
                            })
                          }
                          disabled={!canWithdraw}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {method === "mobile_money" && (
                    <div className="space-y-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                      <h4 className="font-medium text-white flex items-center gap-2">
                        <Phone className="w-4 h-4 text-amber-500" />
                        Mobile Money Details
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-zinc-400 mb-2 block">
                            Provider
                          </label>
                          <select
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                            value={mobileDetails.provider}
                            onChange={(e) =>
                              setMobileDetails({
                                ...mobileDetails,
                                provider: e.target.value,
                              })
                            }
                            disabled={!canWithdraw}
                          >
                            <option value="">Select provider...</option>
                            {mobileProviders.map((provider) => (
                              <option key={provider} value={provider}>
                                {provider}
                              </option>
                            ))}
                          </select>
                        </div>
                        <Input
                          label="Phone Number"
                          placeholder="e.g. +234 xxx xxx xxxx"
                          value={mobileDetails.phoneNumber}
                          onChange={(e) =>
                            setMobileDetails({
                              ...mobileDetails,
                              phoneNumber: e.target.value,
                            })
                          }
                          disabled={!canWithdraw}
                          required
                        />
                        <Input
                          label="Account Name"
                          placeholder="Name on account"
                          value={mobileDetails.accountName}
                          onChange={(e) =>
                            setMobileDetails({
                              ...mobileDetails,
                              accountName: e.target.value,
                            })
                          }
                          disabled={!canWithdraw}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!canWithdraw || !isFormValid()}
                    isLoading={isSubmitting}
                  >
                    Submit Withdrawal Request
                  </Button>
                </form>
              )}
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <h3 className="font-medium text-white mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                Recent Requests
              </h3>
              {userWithdrawals.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center py-4">
                  No withdrawal history
                </p>
              ) : (
                <div className="space-y-3">
                  {userWithdrawals.slice(0, 5).map((w) => (
                    <div
                      key={w.id}
                      className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-emerald-500 font-medium">
                          {formatCurrency(
                            w.amount,
                            currency.code,
                            currency.rate,
                          )}
                        </span>
                        <Badge
                          variant={
                            w.status === "approved"
                              ? "success"
                              : w.status === "rejected"
                                ? "danger"
                                : "warning"
                          }
                        >
                          {w.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-500">
                        {w.method.toUpperCase()} • {w.requestDate}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="bg-zinc-900/50">
              <h3 className="font-medium text-white mb-3">Withdrawal Info</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Minimum withdrawal: $15.00
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Requires 5 referrals
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  Processing: 24-48 hours
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  No withdrawal fees applied
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
