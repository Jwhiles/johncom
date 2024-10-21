import { getListOfEntries, getNumberOfEntries } from "~/contentful.server";

export const getRandomPosts = async () => {
  const numberOfEntries = await getNumberOfEntries();

  const randomEntryOne = (
    await getListOfEntries({
      skip: Math.floor(Math.random() * numberOfEntries),
      limit: 1,
    })
  ).items[0];

  const randomEntryTwo = (
    await getListOfEntries({
      skip: Math.floor(Math.random() * numberOfEntries),
      limit: 1,
    })
  ).items[0];
  // I should probably make sure they aren't the same entry..

  return [randomEntryOne, randomEntryTwo].filter(Boolean);
};
