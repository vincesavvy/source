import { render, screen } from "@testing-library/vue"; // eslint-disable-line
import userEvent from "@testing-library/user-event";
import App from "./App.vue";
import i18n from "./locales/i18n";
import router from "./routes/router";
import { setupServer } from "msw/node";
import { rest } from "msw";

const mockServer = setupServer(
  rest.post("/api/1.0/users/token/:token", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get("/api/1.0/users", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        content: [
          {
            id: 1,
            username: "user-in-list",
            email: "user-in-list@mail.com",
            image: null,
          },
        ],
        page: 0,
        size: 0,
        totalPages: 0,
      })
    );
  }),
  rest.get("/api/1.0/users/:id", (req, res, ctx) => {
    const id = Number.parseInt(req.params.id);
    return res(
      ctx.status(200),
      ctx.json({
        id: id,
        // username: "user" + id,
        username: `user${id}`,
        // email: "user" + id + "@mail.com",
        email: `user${id}@mail.com`,
        image: null,
      })
    );
  })
);

beforeAll(() => {
  mockServer.listen();
});

beforeEach(() => {
  mockServer.resetHandlers();
});

afterAll(() => {
  mockServer.close();
});

const setup = async (path) => {
  render(App, {
    global: {
      plugins: [i18n, router],
    },
  });
  router.replace(path);
  await router.isReady();
};

describe("Routing", () => {
  it.each`
    path                | pageTestId
    ${"/"}              | ${"home-page"}
    ${"/signup"}        | ${"signup-page"}
    ${"/login"}         | ${"login-page"}
    ${"/user/1"}        | ${"user-page"}
    ${"/user/2"}        | ${"user-page"}
    ${"/activate/1234"} | ${"activation-page"}
    ${"/activate/5678"} | ${"activation-page"}
  `("displays $pageTestId when path is $path", async ({ path, pageTestId }) => {
    await setup(path);
    const page = screen.queryByTestId(pageTestId);

    expect(page).toBeInTheDocument();
  });

  it.each`
    path                | pageTestId
    ${"/"}              | ${"signup-page"}
    ${"/"}              | ${"login-page"}
    ${"/"}              | ${"user-page"}
    ${"/"}              | ${"activation-page"}
    ${"/signup"}        | ${"home-page"}
    ${"/signup"}        | ${"login-page"}
    ${"/signup"}        | ${"user-page"}
    ${"/signup"}        | ${"activation-page"}
    ${"/login"}         | ${"home-page"}
    ${"/login"}         | ${"signup-page"}
    ${"/login"}         | ${"user-page"}
    ${"/login"}         | ${"activation-page"}
    ${"/user/1"}        | ${"home-page"}
    ${"/user/1"}        | ${"signup-page"}
    ${"/user/1"}        | ${"login-page"}
    ${"/user/1"}        | ${"activation-page"}
    ${"/activate/1234"} | ${"home-page"}
    ${"/activate/1234"} | ${"login-page"}
    ${"/activate/1234"} | ${"user-page"}
    ${"/activate/1234"} | ${"signup-page"}
  `(
    "Does not display $pageTestId when path is $path",
    async ({ path, pageTestId }) => {
      await setup(path);
      const page = screen.queryByTestId(pageTestId);

      expect(page).not.toBeInTheDocument();
    }
  );

  it.each`
    targetPage
    ${"Home"}
    ${"Sign Up"}
    ${"Login"}
  `("Has a link to $targetPage on NavBar", async ({ targetPage }) => {
    await setup("/");
    const link = screen.queryByRole("link", { name: targetPage });
    expect(link).toBeInTheDocument();
  });

  it.each`
    initialPath  | clickingTo   | visiblePage
    ${"/"}       | ${"Sign Up"} | ${"signup-page"}
    ${"/signup"} | ${"Home"}    | ${"home-page"}
    ${"/"}       | ${"Login"}   | ${"login-page"}
  `(
    "Displays $visiblePage after $clickingTo link",
    async ({ initialPath, clickingTo, visiblePage }) => {
      await setup(initialPath);

      const link = screen.queryByRole("link", { name: clickingTo });

      await userEvent.click(link);

      const page = await screen.findByTestId(visiblePage); //NOTE: We are using "findBy..." because the routing is async.

      expect(page).toBeInTheDocument();
    }
  );

  it("displays home page when clicking brand logo", async () => {
    await setup("/login");

    const image = screen.queryByAltText("Hoaxify Logo");

    await userEvent.click(image);

    const page = await screen.findByTestId("home-page"); //NOTE: We are using "findBy..." because the routing is async.

    expect(page).toBeInTheDocument();
  });

  it("navigates to user page when clicking on username is user list", async () => {
    setup("/");

    const user = await screen.findByText("user-in-list");

    await userEvent.click(user);

    const page = await screen.findByTestId("user-page");

    expect(page).toBeInTheDocument();
  });
});
describe("Login", () => {
  it("redirects to home page after successful login", async () => {
    mockServer.use(
      rest.post("/api/1.0/auth", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ username: "user5" }));
      })
    );
    await setup("/login");

    await userEvent.type(screen.queryByLabelText("Email"), "user5@mail.com");
    await userEvent.type(screen.queryByLabelText("Password"), "P4ssword");
    await userEvent.click(screen.queryByRole("button", { name: "Login" }));

    const page = await screen.findByTestId("home-page");
    expect(page).toBeInTheDocument();
  });
});
