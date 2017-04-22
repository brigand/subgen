import outdent from 'outdent';
import componentDidMount from '../componentDidMount';

it(`works without constructor`, () => {
  const input = outdent`
  class C extends React.Component {
    foo() {

    }
    render() {

    }
  }
  `;

  const out = componentDidMount(input);

  expect(out.indexOf(`componentDidMount`)).not.toBe(-1);
  expect(out).toMatchSnapshot();
});

it(`works with constructor`, () => {
  const input = outdent`
  class C extends React.Component {
    foo() {

    }
    constructor() {

    }
    render() {

    }
  }
  `;

  const out = componentDidMount(input);

  expect(out.indexOf(`componentDidMount`)).not.toBe(-1);
  expect(out).toMatchSnapshot();
});
