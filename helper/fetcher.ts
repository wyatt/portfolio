export const fetcher = async (route: string) => {
  return await fetch(`http://localhost:8080${route}`)
    .then((res) => res.json())
    .catch((e) => {
      return false;
    });
};
