import { render, screen } from "@testing-library/vue";
import LoginPage from "./LoginPage.vue";

const setup = async () => {
  render(LoginPage);
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
});
