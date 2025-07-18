export const TOP_UP_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

export const WITHDRAWAL_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

export const ROLE = {
  MEMBER: "MEMBER",
  ADMIN: "ADMIN",
};

export const BANK_IMAGE = {
  PAYMAYA: "/assets/bank/MAYA.png",
  "QR PH": "/assets/bank/QRPH.png",
  GOTYME: "/assets/bank/GOTYME.jpg",
  BANKO: "/assets/bank/BANKO.png",
  BYBIT: "/assets/bank/BYBIT.png",
};

export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://www.omnixglobal.io";

export const MAX_FILE_SIZE_MB = 12;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const ACTIVE = "ACTIVE";
export const ENDED = "ENDED";

export const bankData = [
  // Banks
  "BDO Unibank, Inc.",
  // "Land Bank of the Philippines (LBP)",
  // "Metropolitan Bank and Trust Company (Metrobank)",
  "Bank of the Philippine Islands (BPI)",
  // "China Banking Corporation (Chinabank)",
  // "Rizal Commercial Banking Corporation (RCBC)",
  // "Philippine National Bank (PNB)",
  // "Security Bank Corporation (Security Bank)",
  // "Union Bank of the Philippines (Unionbank)",
  // "Development Bank of the Philippines (DBP)",
  // "East West Banking Corporation (EastWest Bank)",
  // "Citibank Philippines",
  // "Asia United Bank Corporation (AUB)",
  // "Bank of Commerce (BankCom)",
  // "Philippine Bank of Communications (PBCom)",
  // "Maybank Philippines, Inc.",
  // "CIMB Bank Philippines, Inc.",
  "Gotyme Bank Corporation",
  // "SEABANK Philippines",
  // "OwnBank",

  // E-Wallets
  "GCASH",
  // "COINS.PH",
  "MAYA",
  // "GRABPAY",
  // "SHOPEE PAY",
  // "PALAWAN PAY",
];
