export const validateRegistration = (req, res, next) => {
  const { firstName, lastName, email, age, password } = req.body;

  // Check required fields
  if (!firstName || !lastName || !email || !age || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  // Email validation
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email",
    });
  }

  // Age validation
  if (isNaN(age) || parseInt(age) <= 18) {
    return res.status(400).json({
      success: false,
      message: "Age must be numeric and greater than 18",
    });
  }

  next();
};
