const isEmpty = (value: unknown) => {
  if (value === "" || value === undefined || value === null) {
    return true;
  }
  return false;
};

const validate = (constraints: any) => {
  try {
    const invalidFields: any[] = [];
    const validFields: any = {};

    Object.keys(constraints).forEach((name) => {
      const { optional, validator, value } = constraints[`${name}`];

      if (optional && isEmpty(value)) {
        return;
      }

      const { errorMessage } = validator;

      if (!optional && isEmpty(value)) {
        invalidFields.push({ field: name, error_msg: errorMessage });
        return;
      }

      if (!validator.isValid) {
        validFields[`${name}`] = value;
        return;
      }
      if (!validator.isValid(value)) {
        invalidFields.push({ field: name, error_msg: errorMessage });
      } else {
        validFields[`${name}`] = value;
      }
    });

    return { errors: invalidFields, values: validFields };
  } catch (error: any) {
    console.error(error.message);
    return {
      errors: [{ field: "", error_msg: "error in validation" }],
      values: [],
    };
  }
};

export { validate };
