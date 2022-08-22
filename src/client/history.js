import { createBrowserHistory } from "history";
const history = createBrowserHistory();

export const push = (loc) => () => {
  document.body.scrollTo(0, 0);
  history.push(loc);
};
export default history;
