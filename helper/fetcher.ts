export const fetcher = async (route: string) => {
  try {
    const response = await fetch(`http://localhost:8080${route}`).then((res) =>
      res.json()
    );
    return response;
  } catch (e) {
    return false;
  }
};
