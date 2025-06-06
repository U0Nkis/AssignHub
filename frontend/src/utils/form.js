// Form data to object
export const formDataToObject = (formData) => {
  const object = {};
  formData.forEach((value, key) => {
    object[key] = value;
  });
  return object;
};

// Object to form data
export const objectToFormData = (object) => {
  const formData = new FormData();
  Object.entries(object).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });
  return formData;
};

// Get form values
export const getFormValues = (form) => {
  const formData = new FormData(form);
  return formDataToObject(formData);
};

// Set form values
export const setFormValues = (form, values) => {
  Object.entries(values).forEach(([key, value]) => {
    const element = form.elements[key];
    if (element) {
      if (element.type === 'checkbox') {
        element.checked = value;
      } else if (element.type === 'radio') {
        element.checked = element.value === value;
      } else {
        element.value = value;
      }
    }
  });
};

// Reset form
export const resetForm = (form) => {
  form.reset();
};

// Validate form
export const validateForm = (form, validators) => {
  const errors = {};
  const values = getFormValues(form);

  Object.entries(validators).forEach(([key, validator]) => {
    const value = values[key];
    const error = validator(value, values);
    if (error) {
      errors[key] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Handle form submit
export const handleFormSubmit = async (form, onSubmit, onError) => {
  try {
    const values = getFormValues(form);
    await onSubmit(values);
  } catch (error) {
    if (onError) {
      onError(error);
    }
  }
};

// Handle form change
export const handleFormChange = (form, onChange) => {
  const values = getFormValues(form);
  onChange(values);
};

// Handle form reset
export const handleFormReset = (form, onReset) => {
  resetForm(form);
  if (onReset) {
    onReset();
  }
};

// Handle form validation
export const handleFormValidation = (form, validators, onValidation) => {
  const { isValid, errors } = validateForm(form, validators);
  if (onValidation) {
    onValidation(isValid, errors);
  }
  return { isValid, errors };
}; 