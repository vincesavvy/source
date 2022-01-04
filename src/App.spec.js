import { render, screen } from "@testing-library/vue"; // eslint-disable-line
import userEvent from "@testing-library/user-event";
import App from "./App.vue";
import i18n from "./locales/i18n";

const setup = (path) => {
  window.history.pushState({}, "", path);
  render(App, {
    global: {
      plugins: [i18n],
    },
  });
};

describe("Routing", () => {
  it.each`
    path         | pageTestId
    ${"/"}       | ${"home-page"}
    ${"/signup"} | ${"signup-page"}
    ${"/login"}  | ${"login-page"}
    ${"/user/1"} | ${"user-page"}
    ${"/user/2"} | ${"user-page"}
  `("displays $pageTestId when path is $path", ({ path, pageTestId }) => {
    setup(path);
    const page = screen.queryByTestId(pageTestId);

    expect(page).toBeInTheDocument();
  });

  it.each`
    path         | pageTestId
    ${"/"}       | ${"signup-page"}
    ${"/"}       | ${"login-page"}
    ${"/"}       | ${"user-page"}
    ${"/signup"} | ${"home-page"}
    ${"/signup"} | ${"login-page"}
    ${"/signup"} | ${"user-page"}
    ${"/login"}  | ${"home-page"}
    ${"/login"}  | ${"signup-page"}
    ${"/login"}  | ${"user-page"}
    ${"/user/1"} | ${"home-page"}
    ${"/user/1"} | ${"signup-page"}
    ${"/user/1"} | ${"login-page"}
  `(
    "Does not display $pageTestId when path is $path",
    ({ path, pageTestId }) => {
      setup(path);
      const page = screen.queryByTestId(pageTestId);

      expect(page).not.toBeInTheDocument();
    }
  );

  it.each`
    targetPage
    ${"Home"}
    ${"Sign Up"}
    ${"Login"}
  `("Has a link to $targetPage on NavBar", ({ targetPage }) => {
    setup("/");
    const link = screen.queryByRole("link", { name: targetPage });
    expect(link).toBeInTheDocument();
  });

  it.each`
    initialPath  | clickingTo   | visiblePage
    ${"/"}       | ${"Sign Up"} | ${"signup-page"}
    ${"/signup"} | ${"Home"}    | ${"home-page"}
    ${"/"} | ${"Login"}    | ${"login-page"}
  `(
    "Displays $visiblePage after $clickingTo link",
    async ({ initialPath, clickingTo, visiblePage }) => {
      setup(initialPath);

      const link = screen.queryByRole("link", { name: clickingTo });

      await userEvent.click(link);

      const page = screen.queryByTestId(visiblePage);

      expect(page).toBeInTheDocument();
    }
  );
});