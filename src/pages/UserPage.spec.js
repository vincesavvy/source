import { render, screen, waitFor } from "@testing-library/vue"; // eslint-disable-line
import UserPage from "./UserPage.vue";
import { setupServer } from "msw/node";
import { rest } from "msw";

const mockServer = setupServer(
  rest.get("/api/1.0/users/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        username: "user1",
        email: "user1@mail.com",
        image: null,
      })
    );
  })
);

beforeAll(() => {
  mockServer.listen(); // This means: "before all" tests in this "describe" block, start and listen on the mock server.
});

beforeEach(() => {
  mockServer.resetHandlers();
});

afterAll(() => {
  mockServer.close();
});

const setup = () => {
  render(UserPage, { global: { mocks: { $route: { params: { id: 1 } } } } });
};

describe("User Page", () => {
  it("displays username on page when user is found", async () => {
    setup();
    await waitFor(() => {
      expect(screen.queryByText("user1")).toBeInTheDocument();
    });
  });

  it("displays spinner while the api call is in process", () => {
    setup()
    const spinner = screen.queryByRole("status")

    expect(spinner).toBeInTheDocument()
  })
});
