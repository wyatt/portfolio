export const fetcher = async (route: string) => {
  try {
    const response = await fetch(`http://localhost:8080${route}`).then((res) =>
      res.json()
    );
    console.log(response);
    return response;
  } catch (e) {
    return false;
  }
};
