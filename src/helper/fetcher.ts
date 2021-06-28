export const fetcher = async (route: string) => fetch(`https://wyatt-portfolio.herokuapp.com${route}`).then(res => res.json());
