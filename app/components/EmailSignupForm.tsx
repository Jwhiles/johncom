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
      <label className="mb-2 block text-sm" htmlFor="email">
        Subscribe to new posts by email
      </label>
      <div>
        <input
          className="mr-2"
          type="email"
          name="email"
          placeholder="you@example.com"
        />
        <input type="hidden" value="1" name="embed" />
        <button type="submit" value="Subscribe">
          Subscribe
        </button>
      </div>
    </form>
  </div>
);
