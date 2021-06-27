export const fetcher = async (route: string) => {
	try {
		return await fetch(`https://wyatt-portfolio.herokuapp.com${route}`).then(res => res.json());
	} catch (e) {
		return false;
	}
};
