import UserList from "./UserList.vue";
import { render, screen } from "@testing-library/vue";
import { setupServer } from "msw/node";
import { rest } from "msw";

const mockServer = setupServer(
  rest.get("/api/1.0/users", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(page1));
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

const page1 = {
  content: [
    { id: 4, username: "user4", email: "user4@mail.com", image: null },
    { id: 5, username: "user5", email: "user5@mail.com", image: null },
    { id: 6, username: "user6", email: "user6@mail.com", image: null },
  ],
  page: 1,
  size: 3,
  totalPages: 9,
};

describe("User List", () => {
  
    it("displays 3 users in list", async () => {
      render(UserList)

      const users = await screen.findAllByText(/user/) //NOTE: this is the Regex to find anything text from the const page1 at "username"

      expect(users.length).toBe(3)
    })
})