import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";

import { loader } from "~/routes/lib+/latest_comments";

export default function LatestComments() {
  const fetcher = useFetcher<typeof loader>();

  useEffect(() => {
    if (fetcher.state === "idle" && !fetcher.data) {
      fetcher.load("/lib/latest_comments");
    }
  }, [fetcher]);

  const comments = useLoaderData<typeof loader>();

  return (
    <div>
      <h2>Latest Approved Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <p>{comment.content}</p>
            <p>By: {comment.name}</p>
            <p>Date: {new Date(comment.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
