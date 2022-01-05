import { queryByText, render, screen, waitFor } from "@testing-library/vue"; // eslint-disable-line
import userEvent from "@testing-library/user-event";
import SignUpPage from "./SignUpPage.vue";
import { setupServer } from "msw/node";
import { rest } from "msw";
import LanguageSelector from "../components/LanguageSelector.vue";
import i18n from "../locales/i18n.js";
import en from "../locales/en.json";
import fr from "../locales/fr.json";

// Mock the server to handle the request
let requestBody;
let counter = 0;
let acceptLanguageHeader;

const mockServer = setupServer(
  rest.post("/api/1.0/users", (req, res, context) => {
    requestBody = req.body;
    counter += 1;
    acceptLanguageHeader = req.headers.get("Accept-Language");
    return res(context.status(200));
  })
);

beforeAll(() => {
  mockServer.listen(); // This means: "before all" tests in this "describe" block, start and listen on the mock server.
});

beforeEach(() => {
  counter = 0;
  mockServer.resetHandlers();
});

afterAll(() => {
  // NOTE:
  // The assignment of "requestBody" is done asynchronously after a button is clicked in the next tests.
  // So we used to "await" the mock server to close, thus doing the variable assignment, so that then we can use it.
  // In reality, now, we will wait for the frontend to show the "await screen.findByText("Please check your email to activate your account.");"
  mockServer.close();
});

// The method "findByText" waits for the test to appear.
// The method "queryByText" does not wait, it immediately querying the element. If it cannot find it, returns null.

describe("SignUp Page", () => {
  describe("layout", () => {
    const layoutSetup = () => {
      render(SignUpPage, {
        global: {
          plugins: [i18n],
        },
      });
    };

    //1
    it("Has 'Sign Up' header as h1 present in the document.", () => {
      layoutSetup();
      const heading = screen.queryByRole("heading", { name: "Sign Up" });

      expect(heading).toBeInTheDocument();
    });

    //2
    it("Has username input.", () => {
      layoutSetup();
      const input = screen.queryByLabelText("Username");

      expect(input).toBeInTheDocument();
    });

    //3
    it("Has email input.", () => {
      layoutSetup();
      const input = screen.queryByLabelText("Email");

      expect(input).toBeInTheDocument();
    });

    //4
    it("Has password input.", () => {
      layoutSetup();
      const input = screen.queryByLabelText("Password");

      expect(input).toBeInTheDocument();
    });

    //5 - This next test is checking for the input type is not usually tested. We do it here only to show the possibility. We usually don't check implementation.
    it("Has password type for password input.", () => {
      layoutSetup();
      const input = screen.queryByLabelText("Password");

      expect(input.type).toBe("password");
    });

    //6
    it("Has password repeat input.", () => {
      layoutSetup();
      const input = screen.queryByLabelText("Password Repeat");

      expect(input).toBeInTheDocument();
    });

    //7
    it("Has password type for password repeat input.", () => {
      layoutSetup();
      const input = screen.queryByLabelText("Password Repeat");

      expect(input.type).toBe("password");
    });

    //8
    it("Has 'Sign Up' button.", () => {
      layoutSetup();
      const button = screen.queryByRole("button", { name: "Sign Up" });

      expect(button).toBeInTheDocument();
    });

    //9
    it("Button 'Sign Up' is disabled initially.", () => {
      layoutSetup();
      const button = screen.queryByRole("button", { name: "Sign Up" });

      expect(button).toBeDisabled();
    });
  });

  describe("Interactions", () => {
    let button, passwordInput, passwordRepeatInput, usernameInput;

    const interactionsSetup = async () => {
      render(SignUpPage, {
        global: {
          plugins: [i18n],
        },
      });
      usernameInput = screen.queryByLabelText("Username");
      const emailInput = screen.queryByLabelText("Email");
      passwordInput = screen.queryByLabelText("Password");
      passwordRepeatInput = screen.queryByLabelText("Password Repeat");

      button = screen.queryByRole("button", { name: "Sign Up" });

      await userEvent.type(usernameInput, "user1"); // The "type" action is asynchronus, so this test needs to be async.
      await userEvent.type(emailInput, "user1@mail.com");
      await userEvent.type(passwordInput, "P4ssword");
      await userEvent.type(passwordRepeatInput, "P4ssword");
    };

    const generateValidationError = (field, message) => {
      return rest.post("/api/1.0/users", (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            validationErrors: {
              [field]: message,
            },
          })
        );
      });
    };
    //10
    it("Enables the button when the password and password repeat fields have the same value.", async () => {
      await interactionsSetup();

      expect(button).toBeEnabled();
    });

    //11
    it("Sends username, email and password to backend after clicking button.", async () => {
      await interactionsSetup();

      await userEvent.click(button);

      await screen.findByText(
        "Please check your email to activate your account."
      );

      expect(requestBody).toEqual({
        username: "user1",
        email: "user1@mail.com",
        password: "P4ssword",
      });
    });

    //12
    it("Does not allow clicking on the submit button while there is an ongoing api call.", async () => {
      await interactionsSetup();

      // User Actions
      await userEvent.click(button);

      await userEvent.click(button);

      await screen.findByText(
        "Please check your email to activate your account."
      );

      expect(counter).toBe(1);
    });

    //13
    it("Displays the spinner while api request is in progress.", async () => {
      await interactionsSetup();

      // User Actions
      await userEvent.click(button);

      const spinner = screen.queryByRole("status");

      expect(spinner).toBeInTheDocument();
    });

    //14
    it("Does not display spinner when there is no API request.", async () => {
      await interactionsSetup();

      const spinner = screen.queryByRole("status");

      expect(spinner).not.toBeInTheDocument();
    });

    //15
    it("Displays account activation information after successful sign up request.", async () => {
      await interactionsSetup();

      // User Actions
      await userEvent.click(button);

      // The method "findByText" waits for the test to appear.
      // The method "queryByText" does not wait, it immediately querying the element. If it cannot find it, returns null.

      const text = await screen.findByText(
        "Please check your email to activate your account."
      );

      expect(text).toBeInTheDocument();
    });

    //16
    it("Does not display account activation message before sign up request.", async () => {
      await interactionsSetup();

      const text = screen.queryByText(
        "Please check your email to activate your account."
      );

      expect(text).not.toBeInTheDocument();
    });

    //17
    it("Does NOT display account activation information after failing sign up request.", async () => {
      mockServer.use(
        // With ".use" we can change the handlers.
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(400));
        })
      );

      await interactionsSetup();

      // User Actions
      await userEvent.click(button);

      const text = await screen.queryByText(
        "Please check your email to activate your account."
      );

      expect(text).not.toBeInTheDocument();
    });

    //18
    it("Hides sign up form after successful sign up request.", async () => {
      //NOTE: The last test overwrites the initial setup with a status code of "400". Here we are looking for a "200". This is why we are resetting the handlers in the beforeEach block :)

      await interactionsSetup();

      const form = screen.queryByTestId("form-sign-up");

      // User Actions
      await userEvent.click(button);
      await waitFor(() => {
        expect(form).not.toBeInTheDocument();
      });

      /* IMPORTANT:
       * As is, this test will fail, and it's not obvious why... the reason has to do with the submit method in the frontend. At this time (lecture 15, at 12 min), we are only handling the success case with the "then", which only triggers with a "200" code. But here we want to catch the "400" which is returned as an "error", this is handled with "catch". For now (lecture 15, at 12 min), simply having the "catch" block empty is enough.
       */
    });

    /**
     * VALIDATION
     */

    //19
    it.each`
      field         | message
      ${"username"} | ${"Username cannot be null"}
      ${"email"}    | ${"Email cannot be null"}
      ${"password"} | ${"Password cannot be null"}
    `("Displays $message for field $field.", async ({ field, message }) => {
      mockServer.use(generateValidationError(field, message));

      await interactionsSetup();

      // User Actions
      await userEvent.click(button);

      const text = await screen.findByText(message);

      expect(text).toBeInTheDocument();
    });

    //20
    it("Hides spinner after error response received.", async () => {
      mockServer.use(
        generateValidationError("username", "Username cannot be null")
      );

      await interactionsSetup();

      // User Actions
      await userEvent.click(button);

      await screen.findByText("Username cannot be null");

      const spinner = screen.queryByRole("status");

      expect(spinner).not.toBeInTheDocument();
    });

    //21
    it("Enables the button after error response received.", async () => {
      mockServer.use(
        generateValidationError("username", "Username cannot be null")
      );

      await interactionsSetup();

      // User Actions
      await userEvent.click(button);

      await screen.findByText("Username cannot be null");

      expect(button).toBeEnabled();
    });

    //22
    it("Displays mismatch message for password repeat input.", async () => {
      await interactionsSetup();

      await userEvent.type(passwordInput, "P4ss1");
      await userEvent.type(passwordRepeatInput, "P4ss2");

      const text = await screen.findByText("Password mismatch");

      expect(text).toBeInTheDocument();
    });

    //23
    it.each`
      field         | message                      | label
      ${"username"} | ${"Username cannot be null"} | ${"Username"}
      ${"email"}    | ${"Email cannot be null"}    | ${"Email"}
      ${"password"} | ${"Password cannot be null"} | ${"Password"}
    `(
      "Clears validation errors after $field is updated.",
      async ({ field, message, label }) => {
        mockServer.use(generateValidationError(field, message));

        await interactionsSetup();

        // User Actions
        await userEvent.click(button);

        const text = await screen.findByText(message);
        const input = screen.queryByLabelText(label);
        await userEvent.type(input, "new");

        expect(text).not.toBeInTheDocument();
      }
    );
  });

  describe("Internationalization", () => {
    let frenchLanguage,
      englishLanguage,
      username,
      email,
      password,
      passwordRepeat,
      button;

    const internationalizationSetup = () => {
      const app = {
        components: {
          SignUpPage,
          LanguageSelector,
        },
        template: `
        <SignUpPage/>
        <LanguageSelector/>
        `,
      };
      render(app, {
        global: {
          plugins: [i18n],
        },
      });

      frenchLanguage = screen.queryByTitle("Français");
      englishLanguage = screen.queryByTitle("English");
      username = screen.queryByLabelText(en.username);
      email = screen.queryByLabelText(en.email);
      password = screen.queryByLabelText(en.password);
      passwordRepeat = screen.queryByLabelText(en.passwordRepeat);
      button = screen.queryByRole("button", { name: en.signUp });
    };

    // IMPORTANT: these next lines are now moved in the setupTest.js file in the test folder.
    // afterEach(() => {
    //   i18n.global.locale = "en";
    // });

    //24
    it("Initially displays all text in English.", async () => {
      internationalizationSetup();

      expect(
        screen.queryByRole("heading", { name: en.signUp })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: en.signUp })
      ).toBeInTheDocument();
      expect(screen.queryByLabelText(en.username)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.email)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.password)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.passwordRepeat)).toBeInTheDocument();
    });

    //25
    it("Displays all text in french after selecting that language.", async () => {
      internationalizationSetup();

      await userEvent.click(frenchLanguage);

      expect(
        screen.queryByRole("heading", { name: fr.signUp })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: fr.signUp })
      ).toBeInTheDocument();
      expect(screen.queryByLabelText(fr.username)).toBeInTheDocument();
      expect(screen.queryByLabelText(fr.email)).toBeInTheDocument();
      expect(screen.queryByLabelText(fr.password)).toBeInTheDocument();
      expect(screen.queryByLabelText(fr.passwordRepeat)).toBeInTheDocument();
    });

    //26
    it("Displays all text in english after page is translated to english.", async () => {
      internationalizationSetup();

      await userEvent.click(frenchLanguage);

      await userEvent.click(englishLanguage);

      expect(
        screen.queryByRole("heading", { name: en.signUp })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: en.signUp })
      ).toBeInTheDocument();
      expect(screen.queryByLabelText(en.username)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.email)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.password)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.passwordRepeat)).toBeInTheDocument();
    });

    //27
    it("displays password mismatch validation in french.", async () => {
      internationalizationSetup();

      await userEvent.click(frenchLanguage);
      await userEvent.type(password, "P4ssword");
      await userEvent.type(passwordRepeat, "N3wP4ss");

      const validation = screen.queryByText(fr.passwordMismatch);

      expect(validation).toBeInTheDocument();
    });

    //28
    it("Sends accept-language having en locale to backend for sign up request", async () => {
      internationalizationSetup();
      await userEvent.type(username, "user1");
      await userEvent.type(email, "user1@mail.com");
      await userEvent.type(password, "P4ssword");
      await userEvent.type(passwordRepeat, "P4ssword");

      await userEvent.click(button);

      await screen.findByText(
        "Please check your email to activate your account."
      );

      expect(acceptLanguageHeader).toBe("en");
    });

    //29
    it("Sends accept-language having en locale to backend for sign up request", async () => {
      internationalizationSetup();

      await userEvent.click(frenchLanguage);

      await userEvent.type(username, "user1");
      await userEvent.type(email, "user1@mail.com");
      await userEvent.type(password, "P4ssword");
      await userEvent.type(passwordRepeat, "P4ssword");

      await userEvent.click(button);

      await screen.findByText(fr.acountActivationNotification);

      expect(acceptLanguageHeader).toBe("fr");
    });

    //30
    it("Displays account activation information in french after selecting that language.", async () => {
      internationalizationSetup();

      await userEvent.click(frenchLanguage);

      await userEvent.type(username, "user1");
      await userEvent.type(email, "user1@mail.com");
      await userEvent.type(password, "P4ssword");
      await userEvent.type(passwordRepeat, "P4ssword");

      await userEvent.click(button);

      const accountActivation = await screen.findByText(
        fr.acountActivationNotification
      );

      expect(accountActivation).toBeInTheDocument();
    });
  });
});
