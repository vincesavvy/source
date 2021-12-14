import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";
import SignUpPage from "./SignUpPage.vue";

// The method "findByText" waits for the test to appear.
// The method "queryByText" does not wait, it immediately querying the element. If it cannot find it, returns null.

describe("SignUp Page", () => {
  describe("layout", () => {
    //1
    it("Has 'Sign Up' heading as h1 present in the document.", () => {
      render(SignUpPage);
      const heading = screen.queryByRole("heading", { name: "Sign Up" });

      expect(heading).toBeInTheDocument();
    });

    //2
    it("Has username input.", () => {
      render(SignUpPage);
      const input = screen.queryByLabelText("Username");

      expect(input).toBeInTheDocument();
    });

    //3
    it("Has email input.", () => {
      render(SignUpPage);
      const input = screen.queryByLabelText("Email");

      expect(input).toBeInTheDocument();
    });

    //4
    it("Has password input.", () => {
      render(SignUpPage);
      const input = screen.queryByLabelText("Password");

      expect(input).toBeInTheDocument();
    });

    //5 - This next test is checking for the input type is not usually tested. We do it here only to show the possibility. We usually don't check implementation.
    it("Has password type for password input.", () => {
      render(SignUpPage);
      const input = screen.queryByLabelText("Password");

      expect(input.type).toBe("password");
    });

    //6
    it("Has password repeat input.", () => {
      render(SignUpPage);
      const input = screen.queryByLabelText("Password Repeat");

      expect(input).toBeInTheDocument();
    });

    //7
    it("Has password type for password repeat input.", () => {
      render(SignUpPage);
      const input = screen.queryByLabelText("Password Repeat");

      expect(input.type).toBe("password");
    });

    //8
    it("Has 'Sign Up' button.", () => {
      render(SignUpPage);
      const button = screen.queryByRole("button", { name: "Sign Up" });

      expect(button).toBeInTheDocument();
    });

    //9
    it("Button 'Sign Up' is disabled initially.", () => {
      render(SignUpPage);
      const button = screen.queryByRole("button", { name: "Sign Up" });

      expect(button).toBeDisabled();
    });
  });

  describe("Interactions", async () => {
    let button;

    const setup = async () => {
      render(SignUpPage);
      const usernameInput = screen.queryByLabelText("Username");
      const emailInput = screen.queryByLabelText("Email");
      const passwordInput = screen.queryByLabelText("Password");
      const passwordRepeatInput = screen.queryByLabelText("Password Repeat");

      button = screen.queryByRole("button", { name: "Sign Up" });

      await userEvent.type(usernameInput, "user1"); // The "type" action is asynchronus, so this test needs to be async.
      await userEvent.type(emailInput, "user1@mail.com");
      await userEvent.type(passwordInput, "P4ssword");
      await userEvent.type(passwordRepeatInput, "P4ssword");
    };

    // Mock the server to handle the request
    let requestBody;
    let counter = 0;
    const mockServer = setupServer(
      rest.post("/api/1.0/users", (req, res, context) => {
        requestBody = req.body;
        counter += 1;
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

    //10
    it("Enables the button when the password and password repeat fields have the same value.", async () => {
      await setup();

      expect(button).toBeEnabled();
    });

    //11
    it("Sends username, email and password to backend after clicking button.", async () => {
      await setup();

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
      await setup();

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
      await setup();

      // User Actions
      await userEvent.click(button);

      const spinner = screen.queryByRole("status");

      expect(spinner).toBeInTheDocument();
    });

    //14
    it("Does not display spinner when there is no API request.", async () => {
      await setup();

      const spinner = screen.queryByRole("status");

      expect(spinner).not.toBeInTheDocument();
    });

    //15
    it("Displays account activation information after successful sign up request.", async () => {
      await setup();

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
      await setup();

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

      await setup();

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

      await setup();

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
    it("Displays validation message for username.", async () => {
      mockServer.use(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(400), ctx.json({
            validationErrors : {
              username : "Username cannot be null"
            }
          }));
        })
      );

      await setup();

      // User Actions
      await userEvent.click(button);

      const text = await screen.findByText(
        "Username cannot be null"
      );

      expect(text).toBeInTheDocument();
    });
  });
});
