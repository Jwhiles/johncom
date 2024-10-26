import { json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";

import { getListOfEntries, getNumberOfEntries } from "~/contentful.server";

/* This
 * Api Route returns a random list of posts.
 * This is used to display 'read this next' suggestions
 */
export async function loader() {
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

  return json({ posts: [randomEntryOne, randomEntryTwo].filter(Boolean) });
}

// I misunderstood how this should work. This gives you the data
// For a route you match!!
export function useRandomPostsLoader() {
  const customerFetcher = useFetcher<typeof loader>();

  useEffect(() => {
    customerFetcher.submit({}, { method: "get", action: "/lib/randomPosts" });
  }, []);

  return customerFetcher.data;
}
