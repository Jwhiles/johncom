export const EmailSignupForm = () => (
  <div className="border-t-2 py-6">
    <form
      action="
    https://buttondown.email/api/emails/embed-subscribe/johnwhiles
  "
      method="post"
      target="_blank"
      className=""
    >
      <label className="block mb-2 text-sm" htmlFor="email">
        Subscribe to new posts by email
      </label>
      <div>
        <input
          className="p-1 mr-2"
          type="email"
          name="email"
          placeholder="you@example.com"
        />
        <input type="hidden" value="1" name="embed" />
        <button
          className="border-2 p-2 rounded"
          type="submit"
          value="Subscribe"
        >
          Subscribe
        </button>
      </div>
    </form>
  </div>
);
