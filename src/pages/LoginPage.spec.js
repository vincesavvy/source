import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import LoginPage from "./LoginPage.vue";
import { setupServer } from "msw/node";
import { rest } from "msw";
import LanguageSelector from "../components/LanguageSelector.vue";
import i18n from "../locales/i18n.js";
import en from "../locales/en.json";
import fr from "../locales/fr.json";

let requestBody, acceptLanguageHeader,
  counter = 0;

const mockServer = setupServer(
  rest.post("/api/1.0/auth", (req, res, context) => {
    requestBody = req.body;
    counter += 1;
    acceptLanguageHeader = req.headers.get("Accept-Language");
    return res(
      context.status(401),
      context.json({
        message: "Incorrect credentials",
      })
    );
  })
);

beforeAll(() => {
  mockServer.listen();
});

beforeEach(() => {
  counter = 0;
  mockServer.resetHandlers();
});

afterAll(() => {
  mockServer.close();
});

let emailInput, passwordInput, button;
const setup = async () => {
  render(LoginPage, {
    global: {
      plugins: [i18n],
    },
  });
  emailInput = screen.queryByLabelText("Email");
  passwordInput = screen.queryByLabelText("Password");
  button = screen.queryByRole("button", { name: "Login" });
};

describe("Login Page", () => {
  describe("Layout", () => {
    it("has a login header", async () => {
      await setup();
      const header = screen.queryByRole("heading", { name: "Login" });

      expect(header).toBeInTheDocument();
    });

    it("Has email input.", async () => {
      await setup();
      const input = screen.queryByLabelText("Email");

      expect(input).toBeInTheDocument();
    });

    it("Has password input.", async () => {
      await setup();
      const input = screen.queryByLabelText("Password");

      expect(input).toBeInTheDocument();
    });

    it("Has password type for password input.", async () => {
      await setup();
      const input = screen.queryByLabelText("Password");

      expect(input.type).toBe("password");
    });

    it("Has 'Login' button.", async () => {
      await setup();
      const button = screen.queryByRole("button", { name: "Login" });

      expect(button).toBeInTheDocument();
    });

    it("Button 'Login' is disabled initially.", async () => {
      await setup();
      const button = screen.queryByRole("button", { name: "Login" });

      expect(button).toBeDisabled();
    });
  });

  describe("Interactions", () => {
    const setupFilled = async () => {
      await setup();

      await userEvent.type(emailInput, "user100@mail.com");
      await userEvent.type(passwordInput, "P4ssword");
    };

    it("enables the button when email and password inputs are filled", async () => {
      await setupFilled();

      expect(button).toBeEnabled();
    });

    it("displyas the spinner after clicking the button", async () => {
      await setupFilled();

      expect(screen.queryByRole("status")).not.toBeInTheDocument();

      await userEvent.click(button);

      expect(screen.queryByRole("status")).toBeInTheDocument();
    });

    it("hides spinner after api Call finishes with fail response", async () => {
      await setupFilled();

      await userEvent.click(button);

      const spinner = screen.queryByRole("status");

      await waitFor(() => {
        expect(spinner).not.toBeInTheDocument();
      });
    });

    it("sends email and password to backend after clicking button", async () => {
      await setupFilled();

      await userEvent.click(button);
      const spinner = screen.queryByRole("status");

      await waitForElementToBeRemoved(spinner);

      expect(requestBody).toEqual({
        email: "user100@mail.com",
        password: "P4ssword",
      });
    });

    it("disables the button when there is an api call", async () => {
      await setupFilled();

      await userEvent.click(button);
      await userEvent.click(button);

      const spinner = screen.queryByRole("status");

      await waitForElementToBeRemoved(spinner);

      expect(counter).toBe(1);
    });

    it("displays authentication fail message", async () => {
      await setupFilled();

      await userEvent.click(button);

      const errorMessage = await screen.findByText("Incorrect credentials");

      expect(errorMessage).toBeInTheDocument();
    });

    it("clears authentication fail message when email field is changed", async () => {
      await setupFilled();

      await userEvent.click(button);

      const errorMessage = await screen.findByText("Incorrect credentials");

      await userEvent.type(emailInput, "new@mail.com");

      expect(errorMessage).not.toBeInTheDocument();
    });

    it("clears authentication fail message when password field is changed", async () => {
      await setupFilled();

      await userEvent.click(button);

      const errorMessage = await screen.findByText("Incorrect credentials");

      await userEvent.type(passwordInput, "N3wP4ssword");

      expect(errorMessage).not.toBeInTheDocument();
    });
  });

  describe("Internationalization", () => {
    let frenchLanguage;

    const setupTranslation = () => {
      const app = {
        components: {
          LoginPage,
          LanguageSelector,
        },
        template: `
        <LoginPage/>
        <LanguageSelector/>
        `,
      };
      render(app, {
        global: {
          plugins: [i18n],
        },
      });

      frenchLanguage = screen.queryByTitle("Français");
    };

    it("Initially displays all text in English.", async () => {
      setupTranslation();

      expect(
        screen.queryByRole("heading", { name: en.login })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: en.login })
      ).toBeInTheDocument();
      expect(screen.queryByLabelText(en.email)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.password)).toBeInTheDocument();
    });

    it("displays all text in french after changing language", async () => {
      setupTranslation();

      await userEvent.click(frenchLanguage);

      expect(
        screen.queryByRole("heading", { name: fr.login })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: fr.login })
      ).toBeInTheDocument();
      expect(screen.queryByLabelText(fr.email)).toBeInTheDocument();
      expect(screen.queryByLabelText(fr.password)).toBeInTheDocument();
    });

    it("sends accept-language header as fr in login request", async () => {
      setupTranslation();

      await userEvent.click(frenchLanguage);

      const emailInput = screen.queryByLabelText(fr.email)
      const passwordInput = screen.queryByLabelText(fr.password)

      await userEvent.type(emailInput, "user100@mail.com")
      await userEvent.type(passwordInput, "P4ssword")
      const button = screen.queryByRole("button", { name: fr.login })
      await userEvent.click(button)

      const spinner = screen.queryByRole("status");
      await waitForElementToBeRemoved(spinner)

        expect(acceptLanguageHeader).toBe("fr")
    });
  });
});
