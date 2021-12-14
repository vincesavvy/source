import Input from "./Input.vue";
import { render } from "@testing-library/vue";

//1
it("Has 'is-invalid' class for input when 'help' is set.", () => {
  const {container} = render(Input, { props: { help: "Error message" } });
  const input = container.querySelector('input')
  
  expect(input.classList).toContain("is-invalid")
});

//2
it("Has 'invalid-feedback' class for input when 'help' is set.", () => {
  const {container} = render(Input, { props: { help: "Error message" } });
  const span = container.querySelector('span')
  
  expect(span.classList).toContain("invalid-feedback")
});

//3
it("Does not have 'is-invalid' class for input when 'help' is NOT set.", () => {
  const {container} = render(Input);
  const input = container.querySelector('input')
  
  expect(input.classList).not.toContain("is-invalid")
});
