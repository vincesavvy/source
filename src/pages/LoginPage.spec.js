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

let requestBody,
  counter = 0;

const mockServer = setupServer(
  rest.post("/api/1.0/auth", (req, res, context) => {
    requestBody = req.body;
    counter += 1;
    return res(context.status(401));
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
  render(LoginPage);
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

      expect(counter).toBe(1)
    });
  });
});
