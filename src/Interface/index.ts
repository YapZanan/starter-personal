interface AuthInterface {
	clientId: string;
	clientSecret: string;
	// authorization?: {};
}

interface responseInterface {
	success: boolean;
	message?: string;
	dataSets?: {
		totalData?: number;
		data: {};
	}[];
	error?: {
		message: string;
		field?: string;
	}[];
	validationError?: {};
}
