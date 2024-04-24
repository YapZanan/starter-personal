interface ValidationResult<T> {
	success: boolean;
	errors?: { message: string; field?: keyof T }[];
}

export type ValidationRules<T> = {
	[K in keyof T]?: {
		rule: (value: T[K]) => boolean;
		errorMessage: string;
		allowNull?: boolean;
	};
};

export function validateData<T>(
	data: T,
	rules: ValidationRules<T>,
): ValidationResult<T> {
	const errors: { message: string; field?: keyof T }[] = [];

	for (const key in rules) {
		if (rules.hasOwnProperty(key)) {
			const rule = rules[key];
			const value = data[key];

			if (value === undefined && !rule?.allowNull) {
				errors.push({ message: `${key} is not present`, field: key });
				continue;
			}

			if (rule && !rule.rule(value)) {
				errors.push({ message: rule.errorMessage, field: key });
			}
		}
	}

	if (errors.length > 0) {
		return { success: false, errors };
	}

	return { success: true };
}
