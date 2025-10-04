"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button, Chip, Pagination } from "@mui/material";
import AccountSidebar from "../../components/AccountSidebar";
import { MyContext } from "@/context/ThemeProvider";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchDataFromApi } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/utils/useTranslation";
import Breadcrumb from "@/components/Breadcrumb";
import { FaWallet, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useCurrency } from "@/context/CurrencyContext";

const MyWallet = () => {
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState(""); // "", "CREDIT", "DEBIT"

  const context = useContext(MyContext);
  const router = useRouter();
  const { t } = useTranslation();
  const { convertPrice, getSymbol } = useCurrency();

  // Redirect to login if not logged in
  useEffect(() => {
    if (context?.isLogin === false) {
      router.push("/login");
    }
  }, [context?.isLogin, router]);

  // Fetch wallet data
  const fetchWalletData = async () => {
    try {
      setIsLoading(true);
      const response = await fetchDataFromApi("/api/wallet/details");
      if (response.success) {
        setWalletData(response.data);
        setTransactions(response.data.transactions || []);
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      context.alertBox("error", "Failed to load wallet data");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch transactions with pagination
  const fetchTransactions = async (page = 1, type = "") => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(type && { type }),
      });

      const response = await fetchDataFromApi(`/api/wallet/transactions?${queryParams}`);
      if (response.success) {
        setTransactions(response.data);
        setTotalPages(response.pagination.totalPages);
        setCurrentPage(response.pagination.currentPage);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    if (context?.userData?._id) {
      fetchWalletData();
    }
  }, [context?.userData]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    fetchTransactions(value, filterType);
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    setCurrentPage(1);
    fetchTransactions(1, type);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTransactionIcon = (type) => {
    return type === "CREDIT" ? (
      <FaArrowUp className="text-green-600" />
    ) : (
      <FaArrowDown className="text-red-600" />
    );
  };

  const getTransactionColor = (type) => {
    return type === "CREDIT" ? "text-green-600" : "text-red-600";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        paths={[
          {
            label: "My Wallet",
            href: `/my-wallet`,
          },
        ]}
      />
      <section className="py-3 lg:py-10 w-full">
        <div className="container flex flex-col lg:flex-row gap-5">
          <div className="w-full lg:w-[20%]">
            <AccountSidebar />
          </div>

          <div className="col2 w-full lg:w-[80%]">
            {/* Wallet Balance Card */}
            <div className="card bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 shadow-lg rounded-lg mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-white">
                    {t("wallet.myWallet") || "My Wallet"}
                  </h2>
                  <div className="flex items-center gap-2">
                    <FaWallet className="text-3xl" />
                    <div>
                      <p className="text-sm opacity-90">
                        {t("wallet.availableBalance") || "Available Balance"}
                      </p>
                      <h3 className="text-3xl font-bold">
                        {getSymbol()}{convertPrice(walletData?.walletBalance || 0)}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Filters */}
            <div className="card bg-white p-4 shadow-md rounded-md mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-lg font-semibold">
                  {t("wallet.transactionHistory") || "Transaction History"}
                </h3>
                <div className="flex gap-2 ml-auto">
                  <Button
                    variant={filterType === "" ? "contained" : "outlined"}
                    size="small"
                    onClick={() => handleFilterChange("")}
                    className="!text-xs"
                  >
                    {t("wallet.all") || "All"}
                  </Button>
                  <Button
                    variant={filterType === "CREDIT" ? "contained" : "outlined"}
                    size="small"
                    onClick={() => handleFilterChange("CREDIT")}
                    className="!text-xs !text-green-600 !border-green-600"
                  >
                    {t("wallet.credits") || "Credits"}
                  </Button>
                  <Button
                    variant={filterType === "DEBIT" ? "contained" : "outlined"}
                    size="small"
                    onClick={() => handleFilterChange("DEBIT")}
                    className="!text-xs !text-red-600 !border-red-600"
                  >
                    {t("wallet.debits") || "Debits"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Transactions List */}
            <div className="card bg-white shadow-md rounded-md">
              {transactions.length > 0 ? (
                <>
                  <div className="divide-y divide-gray-200">
                    {transactions.map((transaction, index) => (
                      <div key={transaction._id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                              {getTransactionIcon(transaction.type)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm">
                                {transaction.description}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {formatDate(transaction.createdAt)}
                              </p>
                              <p className="text-xs text-gray-400">
                                ID: {transaction.transactionId}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${getTransactionColor(transaction.type)}`}>
                              {transaction.type === "CREDIT" ? "+" : "-"}
                              {getSymbol()}{convertPrice(transaction.amount)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {t("wallet.balance") || "Balance"}: {getSymbol()}{convertPrice(transaction.balanceAfter)}
                            </p>
                            <Chip
                              label={transaction.status}
                              size="small"
                              color={transaction.status === "COMPLETED" ? "success" : "default"}
                              className="!text-xs mt-1"
                            />
                          </div>
                        </div>
                        {transaction.orderId && (
                          <div className="mt-2 pl-13">
                            <p className="text-xs text-blue-600">
                              {t("wallet.relatedOrder") || "Related to order"}: {transaction.orderId.barcode || transaction.orderId}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center p-4 border-t">
                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="small"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center">
                  <FaWallet className="mx-auto text-6xl text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    {t("wallet.noTransactions") || "No Transactions Yet"}
                  </h3>
                  <p className="text-gray-500">
                    {t("wallet.noTransactionsDesc") || "Your wallet transactions will appear here"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MyWallet;