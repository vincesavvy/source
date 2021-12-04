import SignUpPage from "./SignUpPage.vue";
import { render, screen } from "@testing-library/vue";
import "@testing-library/jest-dom"

it("Has 'Sign Up' heading as h1 present in the document.", () => {
  render(SignUpPage)
  const heading = screen.queryByRole('heading', { name: 'Sign Up'})

  expect(heading).toBeInTheDocument()
});
