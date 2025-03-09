import { bcrypt, validasaur } from "../../deps.js";
import { getData } from "../../utilities.js";
import * as authenticationService from "../../services/authenticationService.js";

const logout = async ({ response, state }) => {
  await state.session.deleteSession();
  response.redirect("/");
};

const showLogin = ({ render }) => {
  render("login.eta");
};

const validateLogin = async ({ request, response, render, state }) => {
  const data = await getData(request);
  const existingUser = await authenticationService.getExistingUser(data.email);
  let credentialsAreRight = true;
  if (existingUser) {
    credentialsAreRight = await bcrypt.compare(data.password, existingUser.password);
  } else {
    credentialsAreRight = false;
  }

  if (credentialsAreRight) {
    await state.session.set("user", { id: existingUser.id, admin: existingUser.admin });
    response.redirect("/topics");
  } else {
    const errors = { loginErrors: ["Username and/or email is wrong"] };
    render("login.eta", { errors: errors, email: data.email });
  }
};

const showRegistration = ({ render }) => {
  render("registration.eta");
};

const validateRegistration = async ({ request, response, render }) => {
  const validationRules = {
    email: [validasaur.required, validasaur.isEmail],
    password: [validasaur.required, validasaur.minLength(4)],
  };
  const data = await getData(request);
  let [passes, errors] = await validasaur.validate(data, validationRules);
  const existingUser = await authenticationService.getExistingUser(data.email);
  if (existingUser) {
    passes = false;
    errors.email ??= [];
    errors.email.push("Email is already in use");
  }

  if (passes) {
    const passwordHash = await bcrypt.hash(data.password);
    authenticationService.addUser(data.email, passwordHash);
    response.redirect("/auth/login");
  } else {
    render("registration.eta", { errors: errors, email: data.email });
  }
};

export { logout, showLogin, validateLogin, showRegistration, validateRegistration };

