import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
// import "whatwg-fetch" // Need this if using "fetch" in the component. Don't need it if using axios.
import { setupServer } from "msw/node";
import { rest } from "msw";
import SignUpPage from "./SignUpPage.vue";

describe("SignUp Page", () => {
  describe("layout", () => {
    it("Has 'Sign Up' heading as h1 present in the document.", () => {
      render(SignUpPage);
      const heading = screen.queryByRole("heading", { name: "Sign Up" });

      expect(heading).toBeInTheDocument();
    });

    it("Has username input.", () => {
      render(SignUpPage);
      const input = screen.queryByLabelText("Username");

      expect(input).toBeInTheDocument();
    });

    it("Has email input.", () => {
      render(SignUpPage);
      const input = screen.queryByLabelText("Email");

      expect(input).toBeInTheDocument();
    });

    it("Has password input.", () => {
      render(SignUpPage);
      const input = screen.queryByLabelText("Password");

      expect(input).toBeInTheDocument();
    });

    //This next test checking for the input type is not usually tested. We do it here only to show the possibility. We usually don't check implementation.
    it("Has password type for password input.", () => {
      render(SignUpPage);
      const input = screen.queryByLabelText("Password");

      expect(input.type).toBe("password");
    });

    it("Has password repeat input.", () => {
      render(SignUpPage);
      const input = screen.queryByLabelText("Password Repeat");

      expect(input).toBeInTheDocument();
    });

    it("Has password type for password repeat input.", () => {
      render(SignUpPage);
      const input = screen.queryByLabelText("Password Repeat");

      expect(input.type).toBe("password");
    });

    it("Has 'Sign Up' button.", () => {
      render(SignUpPage);
      const button = screen.queryByRole("button", { name: "Sign Up" });

      expect(button).toBeInTheDocument();
    });

    it("Button 'Sign Up' is disabled initially.", () => {
      render(SignUpPage);
      const button = screen.queryByRole("button", { name: "Sign Up" });

      expect(button).toBeDisabled();
    });
  });

  describe("Interactions", () => {
    it("Enables the button when the password and password repeat fields have the same value.", async () => {
      render(SignUpPage);
      const passwordInput = screen.queryByLabelText("Password");
      const passwordRepeatInput = screen.queryByLabelText("Password Repeat");

      await userEvent.type(passwordInput, "P4ssword"); // The "type" action is asynchronus, so this test needs to be async.
      await userEvent.type(passwordRepeatInput, "P4ssword");

      const button = screen.queryByRole("button", { name: "Sign Up" });

      expect(button).toBeEnabled();
    });

    it("Sends username, email and password to backend after clicking button.", async () => {
      // Mock the server to handle the request
      let requestBody;
      const mockServer = setupServer(
        rest.post("/api/1.0/users", (req, res, context) => {
          requestBody = req.body
          return res(context.status(200));
        })
      );

      mockServer.listen();

      render(SignUpPage);
      const usernameInput = screen.queryByLabelText("Username");
      const emailInput = screen.queryByLabelText("Email");
      const passwordInput = screen.queryByLabelText("Password");
      const passwordRepeatInput = screen.queryByLabelText("Password Repeat");

      await userEvent.type(usernameInput, "user1"); // The "type" action is asynchronus, so this test needs to be async.
      await userEvent.type(emailInput, "user1@mail.com");
      await userEvent.type(passwordInput, "P4ssword");
      await userEvent.type(passwordRepeatInput, "P4ssword");

      const button = screen.queryByRole("button", { name: "Sign Up" });

      await userEvent.click(button);

      // NOTE: on next line.
      // The assignment of "requestBody" is done asynchronously after the button is clicked.
      // So we await the mock server to close, thus doing the variable assignment, and then we can use it.
      await mockServer.close()

      expect(requestBody).toEqual({
        username: "user1",
        email: "user1@mail.com",
        password: "P4ssword",
      });
    });
  });
});
