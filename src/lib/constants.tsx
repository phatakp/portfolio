import {
	ChartPieIcon,
	HomeIcon,
	ListIcon,
	PiggyBankIcon,
	UserKeyIcon,
	WalletIcon,
} from "lucide-react";

export const APP = {
	MONEYMAP: "MONEYMAP",
	OSIAN: "OSIAN",
};
export const APP_OPTIONS = Object.values(APP);

export const USER_ROLE = {
	ADMIN: "ADMIN",
	USER: "USER",
};
export const USER_ROLE_OPTIONS = Object.values(USER_ROLE);

export const ACCOUNT_TYPE = {
	SAVINGS: "SAVINGS",
	CREDIT_CARD: "CREDIT_CARD",
	MORTGAGE: "MORTGAGE",
	WALLET: "WALLET",
	INVESTMENT: "INVESTMENT",
};
export const ACCOUNT_TYPE_OPTIONS = Object.values(ACCOUNT_TYPE);

export const CLASSIFICATION = {
	ASSET: "ASSET",
	LIABILITY: "LIABILITY",
};
export const CLASSIFICATION_OPTIONS = Object.values(CLASSIFICATION);

export const INVESTMENT_TYPE = {
	MUTUAL_FUND: "FUND",
	EQUITY: "EQUITY",
	RETIREMENT: "RETIREMENT",
	DEPOSIT: "DEPOSIT",
};
export const INVESTMENT_TYPE_OPTIONS = Object.values(INVESTMENT_TYPE);

export const INVESTMENT_SUBTYPE = {
	DEBT: "DEBT",
	EQUITY: "EQUITY",
	COMMODITY: "COMMODITY",
	HYBRID: "HYBRID",
};
export const INVESTMENT_SUBTYPE_OPTIONS = Object.values(INVESTMENT_SUBTYPE);

export const TXN_TYPE = {
	EXPENSE: "EXPENSE",
	INCOME: "INCOME",
	TRANSFER: "TRANSFER",
	INVESTMENT: "INVESTMENT",
};
export const TXN_TYPE_OPTIONS = Object.values(TXN_TYPE);

export const BANK = {
	ALL: [
		"CASH",
		"SBI Bank",
		"ICICI Bank",
		"HDFC Bank",
		"AXIS Bank",
		"CitiBank",
		"Funds India",
		"Ind Money",
		"ICICI Direct",
		"Dezerv",
		"Phone Pe",
		"NPS",
		"EPF",
		"Pluxee",
		"Amazon Pay",
		"Google Pay",
		"Stable Money",
	],
	SAVINGS: [
		"SBI Bank",
		"ICICI Bank",
		"HDFC Bank",
		"AXIS Bank",
		"CitiBank",
		"CASH",
	],
	MORTGAGE: ["SBI Bank", "ICICI Bank", "HDFC Bank", "AXIS Bank", "CitiBank"],
	CREDIT_CARD: ["SBI Bank", "ICICI Bank", "HDFC Bank", "AXIS Bank", "CitiBank"],
	WALLET: ["Phone Pe", "Pluxee", "Amazon Pay", "Google Pay"],
	INVESTMENT: [
		"Funds India",
		"Ind Money",
		"ICICI Direct",
		"Dezerv",
		"Phone Pe",
		"SBI Bank",
		"ICICI Bank",
		"HDFC Bank",
		"AXIS Bank",
		"CitiBank",
		"NPS",
		"EPF",
		"Stable Money",
	],
};
export const BANK_OPTIONS = BANK.ALL;

export const OSIAN = {
	PAYMENTS: "PAYMENTS",
	SCHEDULE: "SCHEDULE",
};

export const OSIAN_OPTIONS = Object.values(OSIAN);

export const PAYMENT_SOURCE = {
	SELF: "Self",
	BANK: "Bank",
};
export const PAYMENT_SOURCE_OPTIONS = Object.values(PAYMENT_SOURCE);

export const PAYMENT_TYPE = {
	BANKEMI: "Bank EMI",
	BANKPRIN: "Bank Principal",
	DEMANDPRIN: "Demand Principal",
	DEMANDGST: "Demand GST",
	STAMPDUTY: "Stamp Duty",
	TDS: "TDS",
};
export const PAYMENT_TYPE_OPTIONS = Object.values(PAYMENT_TYPE);

export const NAVLINKS = [
	{
		href: "/",
		label: "Home",
		icon: <HomeIcon className="size-3.5" />,
		app: null,
	},
	{
		href: "/moneymap/dashboard",
		label: "Dashboard",
		icon: <ChartPieIcon className="size-3.5" />,
		app: APP.MONEYMAP,
	},
	{
		href: "/moneymap/accounts",
		label: "Accounts",
		icon: <WalletIcon className="size-3.5" />,
		app: APP.MONEYMAP,
	},
	{
		href: "/moneymap/investments",
		label: "Investments",
		icon: <PiggyBankIcon className="size-3.5" />,
		app: APP.MONEYMAP,
	},
	{
		href: "/moneymap/transactions",
		label: "Transactions",
		icon: <ListIcon className="size-3.5" />,
		app: APP.MONEYMAP,
	},
	{
		href: "/moneymap/admin",
		label: "Admin",
		icon: <UserKeyIcon className="size-3.5" />,
		isAdminOnly: true,
		app: APP.MONEYMAP,
	},
	{
		href: "/osian/dashboard",
		label: "Dashboard",
		icon: <ChartPieIcon className="size-3.5" />,
		app: APP.OSIAN,
	},
];
