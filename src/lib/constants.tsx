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
	KPEVENTS: "KPEVENTS",
};
export const APP_OPTIONS = Object.values(APP);

export const USER_ROLE = {
	ADMIN: "ADMIN",
	USER: "USER",
};
export const USER_ROLE_OPTIONS = Object.values(USER_ROLE);

export const ACCOUNT_TYPE = {
	SAVINGS: "Savings",
	CREDIT_CARD: "Credit Card",
	MORTGAGE: "Mortgage",
	WALLET: "Wallet",
	INVESTMENT: "Investment",
};
export const ACCOUNT_TYPE_OPTIONS = Object.values(ACCOUNT_TYPE);

export const CLASSIFICATION = {
	ASSET: "Asset",
	LIABILITY: "Liability",
};
export const CLASSIFICATION_OPTIONS = Object.values(CLASSIFICATION);

export const INVESTMENT_TYPE = {
	MUTUAL_FUND: "Mutual Fund",
	EQUITY: "Equity",
	RETIREMENT: "Retirement",
	DEPOSIT: "Deposit",
};
export const INVESTMENT_TYPE_OPTIONS = Object.values(INVESTMENT_TYPE);

export const INVESTMENT_SUBTYPE = {
	DEBT: "Debt",
	EQUITY: "Equity",
	COMMODITY: "Commodity",
	HYBRID: "Hybrid",
};
export const INVESTMENT_SUBTYPE_OPTIONS = Object.values(INVESTMENT_SUBTYPE);

export const TXN_TYPE = {
	EXPENSE: "Expense",
	INCOME: "Income",
	TRANSFER: "Transfer",
	INVESTMENT: "Investment",
};
export const TXN_TYPE_OPTIONS = Object.values(TXN_TYPE);

export const BANK = {
	ALL: [
		"Cash",
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
	Savings: [
		"SBI Bank",
		"ICICI Bank",
		"HDFC Bank",
		"AXIS Bank",
		"CitiBank",
		"Cash",
	],
	Mortgage: ["SBI Bank", "ICICI Bank", "HDFC Bank", "AXIS Bank", "CitiBank"],
	"Credit Card": [
		"SBI Bank",
		"ICICI Bank",
		"HDFC Bank",
		"AXIS Bank",
		"CitiBank",
	],
	Wallet: ["Phone Pe", "Pluxee", "Amazon Pay", "Google Pay"],
	Investment: [
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
