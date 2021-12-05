import SignUpPage from "./SignUpPage.vue";
import { render, screen } from "@testing-library/vue";
import "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event"

describe("SignUp Page", () => {

  describe("layout", () => {

    it("Has 'Sign Up' heading as h1 present in the document.", () => {
      render(SignUpPage)
      const heading = screen.queryByRole('heading', { name: 'Sign Up'})
    
      expect(heading).toBeInTheDocument()
    });

    it("Has username input.", () => {
      render(SignUpPage)
      const input = screen.queryByLabelText('Username')

      expect(input).toBeInTheDocument()
    })

    it("Has email input.", () => {
      render(SignUpPage)
      const input = screen.queryByLabelText('Email')

      expect(input).toBeInTheDocument()
    })

    it("Has password input.", () => {
      render(SignUpPage)
      const input = screen.queryByLabelText('Password')

      expect(input).toBeInTheDocument()
    })

    //This next test checking for the input type is not usually tested. We do it here only to show the possibility. We usually don't check implementation.
    it("Has password type for password input.", () => {
      render(SignUpPage)
      const input = screen.queryByLabelText('Password')

      expect(input.type).toBe("password")
    })

    it("Has password repeat input.", () => {
      render(SignUpPage)
      const input = screen.queryByLabelText('Password Repeat')

      expect(input).toBeInTheDocument()
    })

    it("Has password type for password repeat input.", () => {
      render(SignUpPage)
      const input = screen.queryByLabelText('Password Repeat')

      expect(input.type).toBe("password")
    })

    it("Has 'Sign Up' button.", () => {
      render(SignUpPage)
      const button = screen.queryByRole('button', { name: 'Sign Up'})
    
      expect(button).toBeInTheDocument()
    });

    it("Button 'Sign Up' is disabled initially.", () => {
      render(SignUpPage)
      const button = screen.queryByRole('button', { name: 'Sign Up'})
    
      expect(button).toBeDisabled()
    });
  })

  describe("Interactions", () => {
    
    it("Enables the button when the password and password repeat fields have the same value.", async () => {
      render(SignUpPage)
      const passwordInput = screen.queryByLabelText('Password')
      const passwordRepeatInput = screen.queryByLabelText('Password Repeat')

      await userEvent.type(passwordInput, "P4ssword") // The "type" action is asynchronus, so this test needs to be async.
      await userEvent.type(passwordRepeatInput, "P4ssword")

      const button = screen.queryByRole("button", {name: "Sign Up"})

      expect(button).toBeEnabled()
    })

    it("Sends username, email and password to backend after clicking button.", async () => {
      render(SignUpPage)
      const usernameInput = screen.queryByLabelText('Username')
      const emailInput = screen.queryByLabelText('Email')
      const passwordInput = screen.queryByLabelText('Password')
      const passwordRepeatInput = screen.queryByLabelText('Password Repeat')

      await userEvent.type(usernameInput, "user1") // The "type" action is asynchronus, so this test needs to be async.
      await userEvent.type(emailInput, "user1@mail.com")
      await userEvent.type(passwordInput, "P4ssword")
      await userEvent.type(passwordRepeatInput, "P4ssword")

      const button = screen.queryByRole("button", {name: "Sign Up"})

      await userEvent.click(button);

      expect(button).toBeEnabled()
    })
  })

})


